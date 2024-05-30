import { Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../tabs/home/home.page').then( m => m.HomePage)
      },
      {
        path: 'favorites',
        loadComponent: () => import('../tabs/favorites/favorites.page').then( m => m.FavoritesPage)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ]
  }
];