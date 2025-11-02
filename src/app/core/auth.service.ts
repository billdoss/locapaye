import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedIn = signal<boolean>(!!localStorage.getItem('token'));
  userEmail = signal<string | null>(localStorage.getItem('userEmail'));

  constructor(private router: Router) {}

  login(email: string, password: string) {
    // Fake auth – replace with API call
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('userEmail', email);
    this.userEmail.set(email);
    this.loggedIn.set(true);
    this.router.navigate(['/dashboard']);
  }

  register(fullname: string, email: string, password: string) {
    // Fake register – replace with API call
    this.login(email, password);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    this.loggedIn.set(false);
    this.userEmail.set(null);
    this.router.navigate(['/login']);
  }
}
