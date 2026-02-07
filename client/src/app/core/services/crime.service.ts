import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Crime,
  CrimesQueryParams,
  CrimeStats,
  PaginatedCrimes,
  YearlyTotal,
} from '../models/crime.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CrimeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Paginated, filterable crime query.
   * Supports bounding-box, type, year, and month filters.
   */
  getCrimes(params?: CrimesQueryParams): Observable<PaginatedCrimes> {
    let httpParams = new HttpParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      }
    }
    return this.http.get<PaginatedCrimes>(`${this.baseUrl}/crimes`, {
      params: httpParams,
    });
  }

  /**
   * Legacy endpoint — returns up to 2000 records without pagination.
   * Kept for backward compatibility during migration.
   */
  getCrimesLegacy(): Observable<Crime[]> {
    return this.http.get<Crime[]>(`${this.baseUrl}/getCrimeData`);
  }

  /**
   * Aggregated crime stats from the database (per type + year).
   */
  getCrimeStats(type?: string): Observable<CrimeStats[]> {
    let httpParams = new HttpParams();
    if (type) {
      httpParams = httpParams.set('type', type);
    }
    return this.http.get<CrimeStats[]>(`${this.baseUrl}/crimes/stats`, {
      params: httpParams,
    });
  }

  /**
   * Pre-compiled historical yearly totals (2000-2013).
   * Replaces the hardcoded data that was in the legacy CrimeCtrl.
   */
  getYearlyTotals(): Observable<YearlyTotal[]> {
    return this.http.get<YearlyTotal[]>(
      `${this.baseUrl}/crimes/yearly-totals`,
    );
  }
}
