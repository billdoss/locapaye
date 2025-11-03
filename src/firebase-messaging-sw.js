// Firebase Service Worker pour recevoir les notifications en arrière-plan
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: environment.apiKey,
  authDomain: "locapaye.firebaseapp.com",
  projectId: "locapaye",
  storageBucket: "locapaye.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:xxxxxxxxxxxx"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Message reçu : ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icons/icon-192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
