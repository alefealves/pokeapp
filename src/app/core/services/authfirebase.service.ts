import { Injectable, NgZone } from '@angular/core';
//import * as auth from 'firebase/auth';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
/*import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';*/

@Injectable({
  providedIn: 'root'
})
export class AuthfirebaseService {

  userData: any;

  constructor(
    //public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    //public ngZone: NgZone
  ) {
    this.ngFireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        //JSON.parse(localStorage.getItem('user') || '{}');
      } 
      /*else {
        localStorage.setItem('user', null || '{}');
        JSON.parse(localStorage.getItem('user') || '{}');
      }*/
    });
  }


  async SignIn(email: any, password: any) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password).then((user) => {

      this.ngFireAuth.authState.subscribe((user) => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          //JSON.parse(localStorage.getItem('user') || '{}');
        } 
        /*else {
          localStorage.setItem('user', null || '{}');
          JSON.parse(localStorage.getItem('user') || '{}');
        }*/
      })
    })
  }
  
  async RegisterUser(email: any, password: any) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }

  async SendVerificationMail() {
    return this.ngFireAuth.currentUser.then((user: any) => {
      return user.sendEmailVerification();
    });
  }

  async PasswordRecover(passwordResetEmail: any) {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail);
  }

  
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.emailVerified) {
      return true;
    } else {
      return false;
    }
  }

  
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.emailVerified !== false ? true : false;
  }

  async SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
    });
  }

  async getProfile(): Promise<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {  
      return user;
    }
    return null;
  }

  /*
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  AuthLogin(provider: any) {
    return this.ngFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  
  async SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }*/
  
}
