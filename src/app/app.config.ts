import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Credenciales kanban-angularfire
const firebaseConfig = {
  apiKey: "AIzaSyAEXLJS21jUmx8L3p_gIhh7Pb-3n_Kj_2k",
  authDomain: "kanban-angularfire-251e8.firebaseapp.com",
  projectId: "kanban-angularfire-251e8",
  storageBucket: "kanban-angularfire-251e8.firebasestorage.app",
  messagingSenderId: "1077860058967",
  appId: "1:1077860058967:web:30d0c779648230b705a012"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ]
};