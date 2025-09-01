
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onRefresh: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownTimerRef = useRef<number | undefined>();

  const startCountdown = (seconds: number) => {
    // Clear any existing timer
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    
    setCountdown(seconds);
    
    // Create a single interval
    countdownTimerRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev !== null && prev > 0) {
          return prev - 1;
        } else {
          // Clear the interval when countdown reaches 0
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = undefined;
          }
          return null;
        }
      });
    }, 1000);
  };

  // Clean up the interval on unmount
  React.useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  const handleRefresh = () => {
    if (!isRefreshing && countdown === null) {
      setIsRefreshing(true);
      onRefresh();
      
      // Reset the refreshing state after a short delay to show the animation
      setTimeout(() => {
        setIsRefreshing(false);
        startCountdown(30); // Start 30s countdown
      }, 1000);
    }
  };

  const isButtonDisabled = isRefreshing || countdown !== null;
  const buttonText = countdown !== null ? `${countdown}s` : '';

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleRefresh}
      disabled={isButtonDisabled}
      className="ml-2 flex-shrink-0 min-w-[60px]"
    >
      {buttonText || <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
    </Button>
  );
};

export default React.memo(RefreshButton);
