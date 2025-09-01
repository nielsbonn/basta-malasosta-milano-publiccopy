import React from 'react';

const EmergencyContact = () => {
  return (
    <p className="text-sm text-milano-gray mt-6 text-center">
      In casi di emergenza, chiama la centrale operativa della polizia locale per chiedere un intervento immediato:{' '}
      <a href="tel:020208" className="text-milano-blue hover:underline">
        tel. 02.02.08
      </a>
    </p>
  );
};

export default EmergencyContact;