import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthfirebaseService } from '../services/authfirebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  private auth = inject(AuthfirebaseService);
  private router= inject(Router);
  
  constructor() {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
