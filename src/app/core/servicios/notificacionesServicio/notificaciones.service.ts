import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject, mergeMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private messageSub = new BehaviorSubject<any>(null);
  public message$ = this.messageSub.asObservable();
  private baseUrl = environment.URL_BASE;

  constructor(
    private afMessaging: AngularFireMessaging,
    private http: HttpClient
  ) {
    this.afMessaging.messages.subscribe((msg) => this.messageSub.next(msg));
  }

  pedirPermisoYRegistrar(): void {
    Notification.requestPermission().then((permission) => {
      if (permission !== 'granted') {
        console.warn('Notificaciones DENEGADAS');
        return;
      }
      this.afMessaging.requestToken.subscribe({
        next: (token) => {
          if (token) this.enviarTokenAlBackend(token);
        },
        error: (err) => console.error('Error token FCM', err),
      });
    });
  }

  private enviarTokenAlBackend(token: string) {
    this.http.post(`${this.baseUrl}/push/registrarToken`, { token }).subscribe({
      error: (e) => console.error('Error guardando token', e),
    });
  }
}
