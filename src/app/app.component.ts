import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
  <div class="min-h-screen">
    <header class="px-6 py-4 flex items-center justify-between">
    <div class="logo-container">
      <img src="assets/images/logo.png" alt="LocaPay" width="160">
    </div>
      <nav class="text-sm text-gray-500 hidden md:block">Angular • Firebase • PWA • Tailwind</nav>
    </header>
    <router-outlet></router-outlet>
  </div>
  `
})
export class AppComponent { }