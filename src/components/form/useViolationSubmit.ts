
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { violationTypesList } from '@/types';

export const useViolationSubmit = () => {
  const { toast } = useToast();

  const getViolationTypeName = (violationTypeId: string | null): string => {
    if (!violationTypeId) return 'violazione non specificata';
    const violationType = violationTypesList.find(type => type.id === violationTypeId);
    return violationType ? violationType.name : 'violazione non specificata';
  };

  const sendViolationReport = async (
    userEmail: string,
    violationType: string,
    location: any,
    photo: string,
    timestamp: string
  ) => {
    try {
      const violationTypeName = getViolationTypeName(violationType);
      
      // Extract street and house number from geocoding data
      const geocoding = location.geocoding;
      console.log('Processing geocoding data for email:', geocoding);

      // First prioritize the 'street' field from geocoding
      // Only fall back to other fields if 'street' is not available
      let street = '';
      if (geocoding?.street) {
        street = geocoding.street;
      } else if (geocoding?.name) {
        street = geocoding.name;
      } else {
        street = 'Via non specificata';
      }
      
      const houseNumber = geocoding?.housenumber || '';
      const addressSubject = houseNumber ? `${street}, ${houseNumber}` : street;
      
      console.log('Extracted address components:', {
        geocoding,
        street,
        houseNumber,
        addressSubject
      });

      const response = await supabase.functions.invoke('send-violation-report', {
        body: {
          userEmail,
          violationType: violationTypeName,
          location: location,
          photo,
          timestamp,
          addressSubject
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Errore nell\'invio dell\'email');
      }

      console.log('Violation report email sent successfully');
    } catch (error: any) {
      console.error('Error sending violation report email:', error);
      toast({
        title: "Attenzione",
        description: error.message || "La segnalazione è stata registrata ma c'è stato un problema nell'invio dell'email.",
        variant: "destructive",
      });
      throw error; // Re-throw to be caught by the caller
    }
  };

  const submitViolation = async ({
    photo,
    violationType,
    location,
    userEmail,
    isInMilano,
    onSuccess,
    onError
  }: {
    photo: string | null;
    violationType: string | null;
    location: any;
    userEmail: string;
    isInMilano: boolean;
    onSuccess: () => void;
    onError: () => void;
  }) => {
    try {
      const municipioNumber = location.municipio ? 
        parseInt(location.municipio.match(/\d+/)?.[0] || '0') : 
        null;

      const coordinateString = `${location.coords.latitude},${location.coords.longitude}`;

      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().split(' ')[0];

      const { error } = await supabase
        .from('violazioni')
        .insert({
          giorni: currentDate,
          ora: currentTime,
          municipio: municipioNumber,
          coordinate: coordinateString,
          tipo: violationType
        });

      if (error) {
        throw error;
      }

      // Only proceed with email if db insert was successful
      try {
        await sendViolationReport(
          userEmail,
          violationType,
          location,
          photo,
          `${currentDate} ${currentTime}`
        );
        
        toast({
          title: "Segnalazione Inviata",
          description: "Grazie per aiutarci a mantenere le strade di Milano sicure.",
        });
      } catch (emailError) {
        // Email error is already handled in sendViolationReport
        // We don't rethrow here because we still want to mark the form as successful
        // since the violation was recorded in the database
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'invio della segnalazione.",
        variant: "destructive",
      });
      onError();
    }
  };

  return { submitViolation };
};
