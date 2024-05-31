import { Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";
import { AuthGuardService } from "src/app/core/guards/auth.guard.service";

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../tabs/home/home.page').then( m => m.HomePage),canActivate: [AuthGuardService]
      },
      {
        path: 'favorites',
        loadComponent: () => import('../tabs/favorites/favorites.page').then( m => m.FavoritesPage),canActivate: [AuthGuardService]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ]
  }
];