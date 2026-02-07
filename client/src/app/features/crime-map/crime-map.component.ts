import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { CrimeService } from '../../core/services/crime.service';
import { Crime, CrimeType, PaginatedCrimes } from '../../core/models/crime.model';

const CRIME_TYPE_OPTIONS: CrimeType[] = [
  'FELONY ASSAULT',
  'GRAND LARCENY',
  'GRAND LARCENY OF MOTOR VEHICLE',
  'BURGLARY',
  'ROBBERY',
  'MURDER',
  'RAPE',
];

/**
 * Crime Map component — displays NYC crime incidents on Google Maps.
 *
 * Phase 1: Uses paginated /api/crimes with type filtering.
 * Phase 2: Full Google Maps markers, clustering, and autocomplete.
 */
@Component({
  selector: 'app-crime-map',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './crime-map.component.html',
  styleUrl: './crime-map.component.scss',
})
export class CrimeMapComponent implements OnInit {
  private readonly crimeService = inject(CrimeService);

  /** NYC center coordinates */
  center: google.maps.LatLngLiteral = { lat: 40.7127, lng: -74.0059 };
  zoom = 10;

  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    styles: [
      { stylers: [{ hue: '#00ffe6' }, { saturation: -20 }] },
      {
        featureType: 'landscape',
        stylers: [{ hue: '#0077ff' }, { saturation: 10 }],
      },
      {
        featureType: 'water',
        stylers: [{ hue: '#00ccff' }],
      },
      {
        featureType: 'poi.park',
        stylers: [{ hue: '#44ff00' }, { saturation: -20 }],
      },
      {
        featureType: 'transit.line',
        stylers: [{ hue: '#ff5e00' }],
      },
    ],
  };

  crimes: Crime[] = [];
  loading = true;
  totalRecords = 0;
  currentPage = 1;
  pageSize = 200;
  totalPages = 0;

  // Filter state
  readonly crimeTypeOptions = CRIME_TYPE_OPTIONS;
  selectedType: CrimeType | '' = '';

  ngOnInit(): void {
    this.loadCrimes();
  }

  loadCrimes(): void {
    this.loading = true;
    this.crimeService
      .getCrimes({
        page: this.currentPage,
        limit: this.pageSize,
        ...(this.selectedType ? { type: this.selectedType } : {}),
      })
      .subscribe({
        next: (response: PaginatedCrimes) => {
          this.crimes = response.items;
          this.totalRecords = response.pagination.total;
          this.totalPages = response.pagination.totalPages;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadCrimes();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadCrimes();
  }
}
