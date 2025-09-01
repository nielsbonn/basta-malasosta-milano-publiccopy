
import React, { useState, useEffect } from 'react';
import PhotoCapture from '@/components/PhotoCapture';
import ViolationTypeSelector from '@/components/ViolationTypeSelector';
import LocationDisplay from '@/components/LocationDisplay';
import SubmitButton from '@/components/SubmitButton';
import { Location } from '@/hooks/useLocation';

interface ViolationFormContentProps {
  photo: string | null;
  violationType: string | null;
  isSubmitted: boolean;
  isSubmitting: boolean;
  countdown: number | null;
  location: Location | null;
  isInMilano: boolean;
  onPhotoCapture: (photoData: string) => Promise<void>;
  onViolationTypeSelect: (type: string) => void;
  determineLocation: () => Promise<void>;
  onSubmit: (e: React.FormEvent) => void;
}

const ViolationFormContent = ({
  photo,
  violationType,
  isSubmitted,
  isSubmitting,
  countdown,
  location,
  isInMilano,
  onPhotoCapture,
  onViolationTypeSelect,
  determineLocation,
  onSubmit,
}: ViolationFormContentProps) => {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  
  // Reset dropdown state when form is submitted or reset
  useEffect(() => {
    if (isSubmitted) {
      setIsTypeDropdownOpen(false);
    }
  }, [isSubmitted]);
  
  // This function ensures we track dropdown state correctly
  const handleDropdownOpenChange = (open: boolean) => {
    console.log('Dropdown open state changed:', open);
    setIsTypeDropdownOpen(open);
  };

  // Determine button disabled state with clear logic
  const isButtonDisabled = isTypeDropdownOpen || countdown !== null || isSubmitting;
  
  return (
    <>
      <PhotoCapture 
        onPhotoCapture={onPhotoCapture} 
        photo={photo} 
        isSubmitted={isSubmitted}
        isSubmitting={isSubmitting}
      />
      
      <ViolationTypeSelector 
        onSelect={onViolationTypeSelect} 
        value={violationType}
        disabled={isSubmitted}
        onOpenChange={handleDropdownOpenChange}
      />

      <LocationDisplay 
        location={location} 
        onUpdateLocation={determineLocation}
        isInMilano={isInMilano}
      />

      <SubmitButton 
        isSubmitted={isSubmitted}
        isSubmitting={isSubmitting}
        countdown={countdown}
        onSubmit={onSubmit}
        disabled={isButtonDisabled}
      />
    </>
  );
};

export default ViolationFormContent;
