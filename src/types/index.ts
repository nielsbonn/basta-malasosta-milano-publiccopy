export type ViolationType = {
  id: string;
  name: string;
  description: string;
};

export type ViolationReport = {
  id: string;
  photoUrl: string;
  violationType: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  municipio: string;
};

export const violationTypesList: ViolationType[] = [
  { id: 'green_area', name: 'Area verde', description: 'Veicolo parcheggiato in area verde' },
  { id: 'pedestrian_crossing', name: 'Attraversamento pedonale o ciclabile', description: 'Veicolo che blocca attraversamento pedonale o ciclabile' },
  { id: 'no_parking', name: 'Divieto segnalato da cartello', description: 'Veicolo parcheggiato in zona con divieto' },
  { id: 'double_parking', name: 'Doppia fila', description: 'Veicolo parcheggiato in doppia fila' },
  { id: 'bus_stop', name: 'Fermata autobus o tram', description: 'Veicolo parcheggiato in fermata di autobus o tram' },
  { id: 'sidewalk', name: 'Marciapiede', description: 'Veicolo parcheggiato sul marciapiede' },
  { id: 'bike_lane', name: 'Pista o corsia ciclabile', description: 'Veicolo parcheggiato su pista o corsia ciclabile' },
  { id: 'loading_zone', name: 'Posto carico/scarico', description: 'Veicolo parcheggiato in area carico/scarico' },
  { id: 'disabled_spot', name: 'Posto disabili', description: 'Veicolo non autorizzato in posto disabili' },
  { id: 'corner_intersection', name: 'Prossimità di un incrocio (< 5m)', description: 'Veicolo parcheggiato in angolo o incrocio' },
  { id: 'other', name: 'Altro', description: 'Altra tipologia di violazione' }
];