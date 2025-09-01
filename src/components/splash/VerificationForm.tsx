
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface VerificationFormProps {
  email: string;
  setEmail: (email: string) => void;
  showOTP: boolean;
  otp: string;
  setOtp: (otp: string) => void;
  onSendCode: () => void;
  onVerifyCode: () => void;
}

const VerificationForm = ({
  email,
  setEmail,
  showOTP,
  otp,
  setOtp,
  onSendCode,
  onVerifyCode,
}: VerificationFormProps) => {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  
  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg">
      {!showOTP ? (
        <>
          <p className="text-gray-600 mb-4 text-center">
            Inserisci la tua email per accedere all'applicazione
          </p>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Il tuo indirizzo email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/80"
            />
            <Button
              className="w-full bg-milano-blue hover:bg-blue-700 text-white"
              onClick={onSendCode}
              disabled={!email}
            >
              Invia codice di verifica
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              className="p-0 h-8 w-8 mr-2"
              onClick={() => window.location.reload()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <p className="text-gray-600 text-center flex-1">
              Inserisci il codice di verifica inviato a {email}
            </p>
          </div>
          <div className="space-y-4">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Inserisci il codice a 6 cifre"
              value={otp}
              onChange={handleOTPChange}
              className="text-center text-lg tracking-widest"
            />
            
            <div className="flex items-start space-x-2 mt-4">
              <Checkbox 
                id="privacy-policy" 
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                className="mt-1"
              />
              <Label 
                htmlFor="privacy-policy" 
                className="text-sm text-gray-600 cursor-pointer"
              >
                Ho letto e compreso l'informativa sulla privacy.
              </Label>
            </div>
            
            <Button
              className="w-full bg-milano-blue hover:bg-blue-700 text-white"
              onClick={onVerifyCode}
              disabled={otp.length !== 6 || !privacyAccepted}
            >
              Verifica
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default VerificationForm;
