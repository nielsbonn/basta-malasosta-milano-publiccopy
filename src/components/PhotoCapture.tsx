
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processImage } from '@/utils/imageProcessing';

interface PhotoCaptureProps {
  onPhotoCapture: (photo: string) => void;
  photo: string | null;
  isSubmitted?: boolean;
  isSubmitting?: boolean;
}

const PhotoCapture = ({ onPhotoCapture, photo, isSubmitted, isSubmitting }: PhotoCaptureProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const processedPhoto = await processImage(file);
      onPhotoCapture(processedPhoto);
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'elaborazione dell'immagine.",
        variant: "destructive",
      });
    }
  };

  const handleRetakePhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        ref={fileInputRef}
        className="hidden"
        disabled={isSubmitting}
      />
      
      {photo ? (
        <div className="relative">
          <img
            src={photo}
            alt="Violazione fotografata"
            className="w-full h-64 object-cover rounded-lg"
          />
          {isSubmitted ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
          ) : isSubmitting ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
              <Loader2 className="w-16 h-16 text-white animate-spin" />
            </div>
          ) : (
            <Button
              onClick={handleRetakePhoto}
              className="absolute bottom-4 right-4"
              type="button"
            >
              Scatta di nuovo
            </Button>
          )}
        </div>
      ) : (
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-milano-blue"
          type="button"
          disabled={isSubmitting}
        >
          <Camera className="w-12 h-12 mb-2" />
          <span>Scatta Foto della Violazione</span>
        </Button>
      )}
    </div>
  );
};

export default PhotoCapture;
