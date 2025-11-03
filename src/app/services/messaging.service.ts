import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  constructor(private messaging: Messaging) {}

  async requestPermission() {
    try {
      const token = await getToken(this.messaging, {
        vapidKey: 'BBSYVqVm5z1wEV2R2OIIJPmvpGGbQdyNu6hVRPRmhrvd7lVK3MkmjPI2AvKrpM7cnCLyY7ZtuDXLYTClVvUKcjg'
      });
      console.log('FCM Token:', token);
      return token;
    } catch (err) {
      console.error('Permission denied or error:', err);
      return null;
    }
  }

  listen() {
    onMessage(this.messaging, (payload) => {
      console.log('Message reçu:', payload);
      alert(payload.notification?.title || 'Nouvelle notification');
    });
  }
}
