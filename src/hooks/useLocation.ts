
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Location {
  coords: GeolocationCoordinates;
  address?: string;
  municipio?: string;
  geocoding?: any;
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isInMilano, setIsInMilano] = useState(false);
  const { toast } = useToast();

  const extractMunicipioFromAddress = (geocoding: any) => {
    if (!geocoding) return 'Municipio non trovato';

    // Check if district contains "Municipio"
    const district = geocoding.district || '';
    if (district.includes('Municipio')) {
      return district;
    }

    // Check admin level10 which often contains Municipio information
    const adminLevel10 = geocoding.admin?.level10 || '';
    if (adminLevel10.includes('Municipio')) {
      return adminLevel10;
    }

    return 'Municipio non trovato';
  };

  const checkIfInMilano = (addressData: any) => {
    if (!addressData?.geocoding) {
      console.error('No geocoding data found in response:', addressData);
      return false;
    }

    const geocoding = addressData.geocoding;
    console.log('Geocoding data:', geocoding);

    // Get all possible location identifiers
    const city = (geocoding.city || '').toLowerCase();
    const county = (geocoding.county || '').toLowerCase();
    const district = (geocoding.district || '').toLowerCase();
    const adminLevel8 = (geocoding.admin?.level8 || '').toLowerCase();
    const adminLevel6 = (geocoding.admin?.level6 || '').toLowerCase();
    const country = (geocoding.country || '').toLowerCase();
    
    console.log('Location check:', { 
      city, 
      county, 
      district,
      adminLevel8,
      adminLevel6,
      country 
    });

    // Check if any of the location fields indicate Milano/Milan
    const milanIdentifiers = [city, county, district, adminLevel8, adminLevel6];
    const isMilano = milanIdentifiers.some(identifier => 
      identifier.includes('milano') || identifier.includes('milan')
    );
    
    // Check for Italia/Italy
    const isItalia = 
      country.includes('italia') || 
      country.includes('italy');
    
    console.log('Verification results:', { isMilano, isItalia });
    
    return isMilano && isItalia;
  };

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=geocodejson&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      const data = await response.json();
      console.log('Full Nominatim response:', data);
      
      const feature = data.features?.[0];
      if (!feature?.properties?.geocoding) {
        console.error('Invalid response structure:', data);
        return {
          display_name: 'Indirizzo non trovato',
          geocoding: null
        };
      }

      // Log the full geocoding object to see its structure
      console.log('Geocoding object:', feature.properties.geocoding);

      return {
        display_name: feature.properties.geocoding.label || 'Indirizzo non trovato',
        geocoding: feature.properties.geocoding
      };
    } catch (error) {
      console.error('Errore nel recupero dell\'indirizzo:', error);
      return {
        display_name: 'Ricerca indirizzo fallita',
        geocoding: null
      };
    }
  };

  const determineLocation = async () => {
    if (navigator.geolocation) {
      try {
        // iOS-friendly geolocation options
        const geoOptions: PositionOptions = {
          enableHighAccuracy: true, // Better accuracy for iOS devices
          timeout: 10000,           // 10 second timeout (iOS can be slower)
          maximumAge: 0             // Always get a fresh position
        };

        // Show loading toast
        const loadingToast = toast({
          title: "Rilevamento posizione",
          description: "Attendi mentre rileviamo la tua posizione...",
        });

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            (error) => {
              console.error('Geolocation error code:', error.code);
              console.error('Geolocation error message:', error.message);
              
              // More descriptive error based on error code
              let errorMessage = "Impossibile rilevare la posizione.";
              
              if (error.code === 1) { // PERMISSION_DENIED
                errorMessage = "Permesso negato. Per favore abilita l'accesso alla posizione nelle impostazioni del browser.";
                if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
                  errorMessage += " Su iOS: Impostazioni → Safari → Posizione (o Impostazioni → Chrome → Posizione).";
                }
              } else if (error.code === 2) { // POSITION_UNAVAILABLE
                errorMessage = "La posizione non è disponibile. Controlla che il GPS sia attivo e riprova.";
              } else if (error.code === 3) { // TIMEOUT
                errorMessage = "Timeout nel rilevamento della posizione. Riprova in un'area con migliore copertura GPS.";
              }
              
              reject(new Error(errorMessage));
            },
            geoOptions
          );
        });
        
        // Dismiss loading toast
        loadingToast.dismiss?.();
        
        const { latitude, longitude } = position.coords;
        const addressData = await getAddressFromCoords(latitude, longitude);
        const municipio = extractMunicipioFromAddress(addressData.geocoding);
        
        const inMilano = checkIfInMilano(addressData);
        setIsInMilano(inMilano);
        
        setLocation({
          coords: position.coords,
          address: addressData.display_name,
          municipio,
          geocoding: addressData.geocoding
        });

        if (!inMilano) {
          toast({
            variant: "destructive",
            title: "Posizione non valida",
            description: "La posizione rilevata non sembra essere a Milano.",
          });
        } else {
          toast({
            title: "Posizione Aggiornata",
            description: "La tua posizione è stata aggiornata con successo.",
          });
        }
      } catch (error) {
        console.error('Error determining location:', error);
        toast({
          variant: "destructive",
          title: "Errore Posizione",
          description: error instanceof Error ? error.message : "Impossibile rilevare la posizione. Assicurati che i servizi di localizzazione siano attivi.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "La geolocalizzazione non è supportata dal tuo browser",
      });
    }
  };

  return { location, determineLocation, isInMilano };
};
