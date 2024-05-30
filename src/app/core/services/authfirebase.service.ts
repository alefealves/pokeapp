import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthfirebaseService {

  private ngFireAuth = inject(AngularFireAuth);
  private authState = new BehaviorSubject<User | null>(null);
  isLoggedIn: boolean = false;

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      //this.authState.next(JSON.parse(storedUser));
    }

    this.getProfile().then(user => {
      this.authState.next(user);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.isLoggedIn = true;
      } else {
        localStorage.removeItem('user');
        this.isLoggedIn = false;
      }
    }).catch(error => {
      console.error('Erro ao buscar o perfil:', error);
    });
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  async registerUser(email: string, password: string) {
    return await this.ngFireAuth.createUserWithEmailAndPassword(email, password)
  }

 

  async loginUser(email: string, password: string) {
    const user = await this.ngFireAuth.signInWithEmailAndPassword(email, password);
    if (user) {
      this.isLoggedIn = true;
      return user;
    }
    return null;
  }

  async resetPassword(email: string) {
    return await this.ngFireAuth.sendPasswordResetEmail(email);
  }

  async getProfile():Promise <User | null> {
    return new Promise<User | null>((resolve, reject) => {
      this.ngFireAuth.onAuthStateChanged(user => {
        if (user) {
          resolve(user as User);
        } else {
          resolve(null);
        }
      }, reject);
    })
  }

  async logout(): Promise<void> {
    this.isLoggedIn = false;
    return await this.ngFireAuth.signOut();
  }
}
