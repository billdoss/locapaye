import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedIn = signal<boolean>(false);
  userEmail = signal<string | null>(null);
  constructor(private auth: Auth, private router: Router) {
    this.auth.onAuthStateChanged(user => {
      this.loggedIn.set(!!user);
      this.userEmail.set(user?.email || null);
    });
  }
  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/dashboard']);
  }
  async register(fullname: string, email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/dashboard']);
  }
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}