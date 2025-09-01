
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 shadow-lg border-t z-50">
      <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 text-center sm:text-left">
          Utilizziamo i cookie necessari per il funzionamento dell'applicazione.
        </p>
        <Button 
          onClick={handleAccept}
          className="whitespace-nowrap bg-milano-blue hover:bg-blue-700"
        >
          Chiudi
        </Button>
      </div>
    </div>
  );
};

export default CookieConsent;
