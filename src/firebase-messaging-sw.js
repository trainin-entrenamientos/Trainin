importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBxmGTMVwfk3Im0QwGxV-uYRji21o2llSI",
  authDomain: "trainin-93334.firebaseapp.com",
  projectId: "trainin-93334",
  storageBucket: "trainin-93334.firebasestorage.app",
  messagingSenderId: "907273271268",
  appId: "1:907273271268:web:9f5203e26f90c7d936b9f1",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, { body });
});