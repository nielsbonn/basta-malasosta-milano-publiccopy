
import React from "react";

const SplashScreenHeader = () => {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <img 
          src="/lovable-uploads/c795a006-285b-4faa-8ca3-21fd2e7c5e69.png" 
          alt="Basta Malasosta Milano Logo" 
          className="mx-auto w-48 h-auto mb-8"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Basta Malasosta Milano
        </h1>
        <p className="text-xl font-semibold text-gray-700 mb-3">
          Aiuta a rendere le strade di Milano più sicure e accessibili!
        </p>
        <p className="text-gray-600 text-lg mb-4">
          Con questa app puoi segnalare facilmente alla polizia di Milano le auto parcheggiate in modo incivile e pericoloso.
        </p>
      </div>
    </div>
  );
};

export default SplashScreenHeader;
