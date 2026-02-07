import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Crime, CrimeStats } from '../models/crime.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CrimeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Fetch crime incidents. In Phase 1 this will call the new paginated endpoint.
   * For now it mirrors the legacy GET /api/getCrimeData contract.
   */
  getCrimes(): Observable<Crime[]> {
    return this.http.get<Crime[]>(`${this.baseUrl}/getCrimeData`);
  }

  /**
   * Placeholder for Phase 1 — aggregated yearly stats served from the backend
   * instead of hardcoded data in the controller.
   */
  getCrimeStats(): Observable<CrimeStats[]> {
    return this.http.get<CrimeStats[]>(`${this.baseUrl}/crimes/stats`);
  }
}
