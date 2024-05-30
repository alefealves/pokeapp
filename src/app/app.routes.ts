import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./pages/tabs/details/details.page').then( m => m.DetailsPage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),//canActivate: [AuthGuard]
  },
  {
    path: 'landing',
    loadComponent: () => import('./auth/landing/landing.page').then( m => m.LandingPage)
  },
];
