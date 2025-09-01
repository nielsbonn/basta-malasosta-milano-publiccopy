import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EmailSectionProps {
  userEmail: string;
  onChangeEmail: () => void;
}

const EmailSection = ({ userEmail, onChangeEmail }: EmailSectionProps) => {
  return (
    <div className="text-sm text-gray-600 mt-4 flex items-center gap-2">
      <span>
        La tua segnalazione viene inviata via email alla Polizia Locale di Milano per conto di{' '}
        <span className="underline">{userEmail}</span>.
      </span>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10 shrink-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modificare l'indirizzo email?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione ti riporterà alla schermata iniziale dove potrai inserire un nuovo indirizzo email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={onChangeEmail}>
              Conferma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmailSection;