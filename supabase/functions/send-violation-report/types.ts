
export interface ViolationReport {
  userEmail: string;
  violationType: string;
  address: string;
  photo: string;
  timestamp: string;
}

export const violationTypeMap: { [key: string]: string } = {
  'sidewalk': 'marciapiede',
  'crosswalk': 'attraversamento pedonale',
  'buslane': 'corsia preferenziale',
  'bikelane': 'pista ciclabile',
  'loading': 'area carico/scarico',
  'disabled': 'posto disabili',
  'intersection': 'incrocio',
  'doubleparking': 'doppia fila',
  'greenarea': 'area verde',
  'tramtracks': 'binari del tram'
};
