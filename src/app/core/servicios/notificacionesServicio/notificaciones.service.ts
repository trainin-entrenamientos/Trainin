import { Injectable } from '@angular/core';
import { BehaviorSubject, mergeMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private messaging: Messaging;
  public message$ = new BehaviorSubject<any>(null);
  private baseUrl = environment.URL_BASE;

  constructor(private http: HttpClient) {
    const app = initializeApp(environment.firebase);
    this.messaging = getMessaging(app);

    onMessage(this.messaging, payload => {
      this.message$.next(payload);
    });
  }

  public pedirPermisoYRegistrar(): void {
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        console.warn('Notificaciones DENEGADAS');
        return;
      }

      navigator.serviceWorker.getRegistration().then(swReg => {
        if (!swReg) {
          console.error('No hay Service Worker registrado para FCM');
          return;
        }

        getToken(this.messaging, {
          vapidKey: environment.firebase.vapidKey,
          serviceWorkerRegistration: swReg
        })
        .then(token => {
          if (token) {
            this.enviarTokenAlBackend(token);
          }
        })
        .catch(err => console.error('Error obteniendo token FCM', err));
      });
    });
  }

  private enviarTokenAlBackend(token: string) {
    this.http.post(`${this.baseUrl}/notificacion/registrarToken`, { token }).subscribe({
      error: (e) => console.error('Error guardando token', e),
    });
  }
}
