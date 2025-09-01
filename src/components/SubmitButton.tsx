
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckSquare, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitted: boolean;
  isSubmitting: boolean;
  countdown: number | null;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}

const SubmitButton = ({ isSubmitted, isSubmitting, countdown, onSubmit, disabled }: SubmitButtonProps) => {
  // Add a local state to track visual disabled state
  // This helps prevent flickering or stuck states
  const [isVisuallyDisabled, setIsVisuallyDisabled] = useState(disabled);
  
  // Use a ref for tracking the previous countdown value to minimize re-renders
  const prevCountdownRef = useRef<number | null>(countdown);
  
  // Update visual disabled state when props change
  useEffect(() => {
    // Use a small delay to allow other state changes to complete
    const timer = setTimeout(() => {
      setIsVisuallyDisabled(disabled);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [disabled, isSubmitting, countdown]);
  
  // Only update the ref when countdown changes to avoid unnecessary re-renders
  if (prevCountdownRef.current !== countdown) {
    prevCountdownRef.current = countdown;
  }
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formEvent = new Event('submit', {
      bubbles: true,
      cancelable: true
    }) as unknown as React.FormEvent;
    onSubmit(formEvent);
  };

  // Determine actual disabled state with fallback logic
  const actuallyDisabled = isVisuallyDisabled || isSubmitting || countdown !== null;

  return (
    <Button 
      type="submit" 
      className={`w-full ${isSubmitted ? 'bg-green-600 hover:bg-green-700' : 'bg-milano-blue hover:bg-milano-blue/90'}`}
      disabled={actuallyDisabled}
      onClick={handleClick}
    >
      {countdown !== null ? (
        <>
          <Progress value={(1 - countdown) * 100} className="w-full h-2" />
          <span className="ml-2">Ricomincio fra {Math.ceil(countdown)}...</span>
        </>
      ) : isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Invio in corso...
        </>
      ) : isSubmitted ? (
        <>
          <CheckSquare className="mr-1" />
          Clicca per una nuova segnalazione
        </>
      ) : (
        'Invia Segnalazione'
      )}
    </Button>
  );
};

export default React.memo(SubmitButton);
