import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private currentToken = new BehaviorSubject<string|null>(null);
  public token$ = this.currentToken.asObservable();

  constructor(private afMessaging: AngularFireMessaging) {
    this.afMessaging.messages.subscribe(msg => {
      console.log('Notificación recibida:', msg);
    });
  }

  pedirPermiso(): void {
    this.afMessaging.requestToken.subscribe({
      next: token => {
        console.log('Token FCM obtenido:', token);
        this.currentToken.next(token);
      },
      error: err => {
        console.error('Error obteniendo token FCM:', err);
        this.currentToken.next(null);
      }
    });
  }

  obtenerToken(): string|null {
    return this.currentToken.value;
  }
}
