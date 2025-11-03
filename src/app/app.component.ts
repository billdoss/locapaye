import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MessagingService } from './services/messaging.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
  <div class="min-h-screen">
    <header class="px-6 py-4 flex items-center justify-between">
      <a routerLink="/" class="font-semibold text-gray-700">LocaPaye</a>
      <nav class="text-sm text-gray-500 hidden md:block">Angular • Firebase • PWA • Tailwind</nav>
    </header>
    <router-outlet></router-outlet>
  </div>
  `
})
export class AppComponent implements OnInit {
  constructor(private messagingService: MessagingService) {}
  ngOnInit(): void {
    this.messagingService.requestPermission();
    this.messagingService.listen();
  }
}
