
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface InstallButtonProps {
  isCompactButton: boolean;
  onClick: () => void;
}

const InstallButton = ({ isCompactButton, onClick }: InstallButtonProps) => {
  return (
    <Button
      onClick={onClick}
      style={{ 
        transition: 'width 2s ease-in-out',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}
      className={`fixed bottom-4 right-4 shadow-lg z-50 bg-primary text-primary-foreground hover:bg-primary/90 ${
        isCompactButton ? 'w-[40px]' : 'w-[160px]'
      }`}
    >
      <div className={`flex items-center justify-start ${isCompactButton ? 'w-[40px]' : 'w-[160px]'}`} 
           style={{ transition: 'width 2s ease-in-out' }}>
        <Download className="w-4 h-4" />
        {!isCompactButton && (
          <span className="ml-2">
            Installa come app
          </span>
        )}
      </div>
    </Button>
  );
};

export default InstallButton;
