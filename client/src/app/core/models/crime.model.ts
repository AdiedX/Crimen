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

/** Paginated response from GET /api/crimes */
export interface PaginatedCrimes {
  items: Crime[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Query params for GET /api/crimes */
export interface CrimesQueryParams {
  page?: number;
  limit?: number;
  swLat?: number;
  swLng?: number;
  neLat?: number;
  neLng?: number;
  type?: CrimeType;
  year?: number;
  month?: number;
}

/** Aggregated stats from GET /api/crimes/stats */
export interface CrimeStats {
  type: string;
  title: string;
  name: string;
  data: { year: number; count: number }[];
}

/** Historical yearly totals from GET /api/crimes/yearly-totals */
export interface YearlyTotal {
  type: string;
  name: string;
  title: string;
  years: number[];
  data: number[];
}
