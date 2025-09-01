export const formatDateTimeItalian = (timestamp: string): string => {
  const [date, time] = timestamp.split(' ');
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}, ${time}`;
};

export const parseAddress = (fullAddress: string): string => {
  // Split the address at the first comma to get just the street part
  const streetPart = fullAddress.split(',')[0] || 'Indirizzo non disponibile';
  
  // Remove any house numbers from the street name
  // This will match patterns like "Via Roma 123", "Piazza Duomo 1A", etc.
  const streetName = streetPart.replace(/\s+\d+\w*$/, '').trim();
  
  return streetName;
};

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Extract the municipio number from the string (e.g., "Municipio 9" -> "9")
export const getMunicipioNumber = (municipioStr: string): string => {
  const match = municipioStr?.match(/\d+/);
  return match ? match[0] : '';
};

// Generate police email address based on municipio number
export const getPoliceEmail = (municipioStr: string): string => {
  const municipioNumber = getMunicipioNumber(municipioStr);
  return municipioNumber ? `Pl.Zona${municipioNumber}@comune.milano.it` : 'Email non disponibile';
};
