export interface Crime {
  id: string;
  latitude: number;
  longitude: number;
  type: CrimeType;
  month: number;
  year: number;
}

export type CrimeType =
  | 'FELONY ASSAULT'
  | 'GRAND LARCENY'
  | 'GRAND LARCENY OF MOTOR VEHICLE'
  | 'BURGLARY'
  | 'ROBBERY'
  | 'MURDER'
  | 'RAPE';

export interface CrimeStats {
  type: string;
  title: string;
  name: string;
  data: { year: number; count: number }[];
}
