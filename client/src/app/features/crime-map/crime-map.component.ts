import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { CrimeService } from '../../core/services/crime.service';
import { Crime } from '../../core/models/crime.model';

/**
 * Crime Map component — displays NYC crime incidents on Google Maps.
 *
 * Phase 0: Scaffold with placeholder UI.
 * Phase 2: Full Google Maps integration with markers, clustering, and autocomplete.
 */
@Component({
  selector: 'app-crime-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
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

  ngOnInit(): void {
    this.crimeService.getCrimes().subscribe({
      next: (data) => {
        this.crimes = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
