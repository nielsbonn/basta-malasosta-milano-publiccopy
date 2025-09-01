
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const useInstallPrompt = () => {
  // Check if app is in standalone mode immediately
  const isStandalone = typeof window !== 'undefined' && 
    (window.matchMedia('(display-mode: standalone)').matches || 
    (window.navigator as any).standalone === true);

  const [isCompactButton, setIsCompactButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(isStandalone);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const { toast } = useToast();

  const showToast = useCallback((message: string, title?: string) => {
    toast({
      title,
      description: message,
    });
  }, [toast]);

  useEffect(() => {
    if (isStandalone) {
      console.log('App is already installed');
      return;
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      console.log('beforeinstallprompt event was fired');
      deferredPromptRef.current = e;
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      showToast("App installata con successo!", "Successo");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone, showToast]);

  useEffect(() => {
    if (!isInstalled) {
      const timeout = setTimeout(() => {
        setIsCompactButton(true);
      }, 7000);
      return () => clearTimeout(timeout);
    }
  }, [isInstalled]);

  const getInstallInstructions = useCallback(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /ipad|iphone|ipod/.test(ua);
    const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
    const isFirefox = /firefox/.test(ua);
    const isChrome = /chrome/.test(ua) || /chromium/.test(ua);

    if (isIOS) {
      return "Per installare l'app su iOS:\n1. Apri Safari\n2. Tocca l'icona di condivisione (□↑)\n3. Seleziona 'Aggiungi alla schermata Home'";
    } else if (isSafari) {
      return "Per installare su Safari:\n1. Apri il menu File\n2. Cerca l'opzione 'Aggiungi alla Dock' o 'Installa come App'";
    } else if (isFirefox) {
      return "Per installare su Firefox:\n1. Clicca i tre puntini (...) nella barra degli indirizzi\n2. Seleziona 'Installa sito come app'";
    } else if (isChrome) {
      return "Per installare su Chrome:\n1. Clicca i tre puntini (⋮) in alto a destra\n2. Cerca 'Installa app' o 'Aggiungi a schermata Home'";
    }
    return "Per installare l'app:\n1. Cerca il pulsante di installazione nel menu del browser\n2. Segui le istruzioni sullo schermo";
  }, []);

  const triggerInstall = useCallback(async () => {
    const deferredPrompt = deferredPromptRef.current;
    
    if (!deferredPrompt) {
      console.log('No installation prompt available, showing manual instructions');
      showToast(getInstallInstructions());
      return;
    }

    try {
      console.log('Triggering install prompt');
      await deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
        deferredPromptRef.current = null;
      } else {
        console.log('User dismissed the install prompt');
        showToast("Installazione annullata", "Informazione");
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
      showToast(getInstallInstructions());
    }
  }, [getInstallInstructions, showToast]);

  return {
    showInstallButton: !isInstalled,
    isCompactButton,
    triggerInstall,
    getInstallInstructions
  };
};
