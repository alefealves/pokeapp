import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/tabs/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./pages/tabs/details/details.page').then( m => m.DetailsPage)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/tabs/favorites/favorites.page').then( m => m.FavoritesPage)
  },
];
