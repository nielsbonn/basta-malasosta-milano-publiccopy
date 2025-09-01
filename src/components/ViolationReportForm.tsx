
import React from 'react';
import { Card } from '@/components/ui/card';
import FormHeader from './form/FormHeader';
import EmergencyContact from './form/EmergencyContact';
import { Separator } from '@/components/ui/separator';
import ViolationFormContent from './form/ViolationFormContent';
import EmailSection from './form/EmailSection';
import { useViolationForm } from './form/useViolationForm';
import { useViolationSubmit } from './form/useViolationSubmit';
import { useToast } from '@/hooks/use-toast';

interface ViolationReportFormProps {
  onResetApp?: () => void;
}

const ViolationReportForm = ({ onResetApp }: ViolationReportFormProps) => {
  const { toast } = useToast();
  const {
    photo,
    violationType,
    isSubmitted,
    isSubmitting,
    countdown,
    userEmail,
    location,
    isInMilano,
    setViolationType,
    setIsSubmitted,
    setIsSubmitting,
    setCountdown,
    handlePhotoCapture,
    determineLocation
  } = useViolationForm(onResetApp);

  const { submitViolation } = useViolationSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitted) {
      setCountdown(1);
      return;
    }

    // Validate required information before proceeding
    if (!photo || !violationType || !location || !isInMilano) {
      toast({
        title: "Informazioni Mancanti",
        description: !isInMilano 
          ? "La segnalazione deve essere effettuata da Milano."
          : "Per favore fornisci tutte le informazioni richieste.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    await submitViolation({
      photo,
      violationType,
      location,
      userEmail,
      isInMilano,
      onSuccess: () => {
        setIsSubmitted(true);
        setIsSubmitting(false);
      },
      onError: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleChangeEmail = () => {
    if (onResetApp) {
      localStorage.removeItem('emailVerified');
      localStorage.removeItem('userEmail');
      onResetApp();
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormHeader />

        <ViolationFormContent 
          photo={photo}
          violationType={violationType}
          isSubmitted={isSubmitted}
          isSubmitting={isSubmitting}
          countdown={countdown}
          location={location}
          isInMilano={isInMilano}
          onPhotoCapture={handlePhotoCapture}
          onViolationTypeSelect={setViolationType}
          determineLocation={determineLocation}
          onSubmit={handleSubmit}
        />

        <EmailSection 
          userEmail={userEmail}
          onChangeEmail={handleChangeEmail}
        />

        <Separator className="my-6" />
        <EmergencyContact />
      </form>
    </Card>
  );
};

export default ViolationReportForm;
