import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SplashScreenHeader from "./splash/SplashScreenHeader";
import VerificationForm from "./splash/VerificationForm";
import CookieConsent from "./splash/CookieConsent";
import PrivacyLinks from "./splash/PrivacyLinks";

interface SplashScreenProps {
  onVerified: () => void;
}

const SplashScreen = ({ onVerified }: SplashScreenProps) => {
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Errore",
        description: "Inserisci un indirizzo email valido",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("send-verification", {
        body: { email },
      });

      if (error) throw error;

      setShowOTP(true);
      toast({
        title: "Codice inviato",
        description: "Controlla la tua email per il codice di verifica",
      });
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast({
        title: "Limite di accessi giornalieri raggiunto.",
        description: "Riprova domani o supportaci per aggiungere maggiore capacità alla rete.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyCode = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Errore",
        description: "Inserisci il codice completo",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("verify-code", {
        body: { email, code: otp },
      });

      if (error) throw error;

      localStorage.setItem("emailVerified", "true");
      localStorage.setItem("userEmail", email);
      onVerified();
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: "Errore",
        description: "Codice non valido",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 pb-20 md:pb-12 relative" style={{ backgroundColor: "#d5dadb" }}>
      <div className="w-full max-w-md mx-auto">
        <SplashScreenHeader />
        <div className="mt-8">
          <VerificationForm
            email={email}
            setEmail={setEmail}
            showOTP={showOTP}
            otp={otp}
            setOtp={setOtp}
            onSendCode={handleSendCode}
            onVerifyCode={handleVerifyCode}
          />
        </div>
      </div>
      <PrivacyLinks />
      <CookieConsent />
    </div>
  );
};

export default SplashScreen;
