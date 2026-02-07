import { Routes } from '@angular/router';
import { CrimeMapComponent } from './features/crime-map/crime-map.component';
import { CrimeChartsComponent } from './features/crime-charts/crime-charts.component';
import { AboutComponent } from './features/about/about.component';

export const routes: Routes = [
  { path: '', component: CrimeMapComponent },
  { path: 'crime', component: CrimeChartsComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' },
];
