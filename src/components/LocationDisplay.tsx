
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LocationDetails {
  coords: GeolocationCoordinates;
  address?: string;
  municipio?: string;
}

interface LocationDisplayProps {
  location: LocationDetails | null;
  onUpdateLocation: () => void;
  isInMilano: boolean;
}

const LocationDisplay = ({ location, onUpdateLocation, isInMilano }: LocationDisplayProps) => {
  if (!location) return null;

  // Extract the municipio number from the string (e.g., "Municipio 9" -> "9")
  const getMunicipioNumber = (municipioStr: string): string => {
    const match = municipioStr.match(/\d+/);
    return match ? match[0] : '';
  };

  // Generate police email address based on municipio number
  const getPoliceEmail = (municipioStr: string): string => {
    const municipioNumber = getMunicipioNumber(municipioStr);
    return municipioNumber ? `Pl.Zona${municipioNumber}@comune.milano.it` : 'Email non disponibile';
  };

  const municipioEmailAddress = location.municipio ? getPoliceEmail(location.municipio) : 'Email non disponibile';

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <div className={isInMilano ? "text-green-600" : "text-red-600"}>
          {isInMilano 
            ? "Posizione rilevata con successo"
            : "Non sembri a Milano. Clicca il pin per aggiornare la posizione."}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onUpdateLocation}
          className="ml-2"
          title="Rileva nuovamente la posizione"
          type="button"
        >
          <MapPin className="w-4 h-4" />
        </Button>
      </div>
      <div className="text-gray-600">
        <div><strong>Indirizzo:</strong> {location.address}</div>
        <div className="mt-2"><strong>Email Polizia Locale:</strong> {municipioEmailAddress}</div>
      </div>
    </div>
  );
};

export default LocationDisplay;
