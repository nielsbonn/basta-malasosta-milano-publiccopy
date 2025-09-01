
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/useLocation';

export const useViolationForm = (onResetApp?: () => void) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [violationType, setViolationType] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const { toast } = useToast();
  const { location, determineLocation, isInMilano } = useLocation();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      if (onResetApp) {
        onResetApp();
      }
    } else {
      setUserEmail(email);
    }
  }, [onResetApp]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 0.1);
      }, 100);
      return () => clearTimeout(timer);
    } else if (countdown !== null && countdown <= 0) {
      resetForm();
      setCountdown(null);
    }
  }, [countdown]);

  const resetForm = () => {
    setPhoto(null);
    setViolationType(null);
    setIsSubmitted(false);
  };

  const handlePhotoCapture = async (photoData: string) => {
    setPhoto(photoData);
    await determineLocation();
  };

  const handleViolationTypeSelect = (type: string) => {
    setViolationType(type);
  };

  return {
    photo,
    violationType,
    isSubmitted,
    isSubmitting,
    countdown,
    userEmail,
    location,
    isInMilano,
    setViolationType: handleViolationTypeSelect,
    setIsSubmitted,
    setIsSubmitting,
    setCountdown,
    handlePhotoCapture,
    determineLocation,
    resetForm
  };
};
