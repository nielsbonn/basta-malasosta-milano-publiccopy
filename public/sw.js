
const CACHE_VERSION = '1.0.0';
const STATIC_CACHE_NAME = `malasosta-mi-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `malasosta-mi-dynamic-v${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `malasosta-mi-images-v${CACHE_VERSION}`;

// Assets that should be pre-cached
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
];

// Assets that should be cached as they're used
const DYNAMIC_ASSETS = [
  '/lovable-uploads/',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const staticCache = await caches.open(STATIC_CACHE_NAME);
      await staticCache.addAll(STATIC_ASSETS);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Get all cache names
      const cacheNames = await caches.keys();
      // Delete old caches
      await Promise.all(
        cacheNames
          .filter(name => name.startsWith('malasosta-mi-') && 
                         name !== STATIC_CACHE_NAME &&
                         name !== DYNAMIC_CACHE_NAME &&
                         name !== IMAGE_CACHE_NAME)
          .map(name => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  const networkPromise = fetch(request).then(async (response) => {
    if (response.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
    }
    return response;
  });

  return cachedResponse || networkPromise;
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      await cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and browser-sync requests
  if (event.request.method !== 'GET' || url.pathname.startsWith('browser-sync')) {
    return;
  }

  // Handle API requests
  if (url.hostname === 'ublorjgvkgbiojihardt.supabase.co') {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset))) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Handle images
  if (url.pathname.startsWith('/lovable-uploads/') || 
      event.request.destination === 'image') {
    event.respondWith(
      staleWhileRevalidate(event.request, IMAGE_CACHE_NAME)
    );
    return;
  }

  // Default strategy: stale-while-revalidate
  event.respondWith(
    staleWhileRevalidate(event.request, DYNAMIC_CACHE_NAME)
  );
});

// Handle background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-violations') {
    event.waitUntil(syncViolations());
  }
});

// Optional: Periodic sync for updating violation data
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-violations') {
    event.waitUntil(updateViolations());
  }
});

// Background sync function for violations
async function syncViolations() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const requests = await cache.keys();
    const syncRequests = requests.filter(request => 
      request.headers.get('x-sync-pending')
    );

    await Promise.all(
      syncRequests.map(async (request) => {
        try {
          await fetch(request);
          await cache.delete(request);
        } catch (error) {
          console.error('Sync failed for request:', request.url);
        }
      })
    );
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Periodic sync function for updating violation data
async function updateViolations() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    // Add logic to fetch and update violation data
  } catch (error) {
    console.error('Periodic sync failed:', error);
  }
}

