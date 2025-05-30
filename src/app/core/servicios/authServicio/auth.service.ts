import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginResponseDTO } from '../../modelos/LoginResponseDTO';
import { RegistroDTO } from '../../modelos/RegistroDTO';
import { tokenExpirado } from '../../utilidades/token-utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:5010/api/Usuario';
  private readonly TOKEN_KEY = 'token';
  private CLAIM_EMAIL = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
  private usuarioSubject = new BehaviorSubject<string | null>(null);
  email: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token && !tokenExpirado(token)) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.usuarioSubject.next(payload[this.CLAIM_EMAIL]);
    } else {
      this.cerrarSesion();
    }
  }

  get usuario() {
    return this.usuarioSubject.asObservable();
  }

  login(credenciales: { email: string; contrasenia: string }): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>('http://localhost:5010/api/Usuario/login', credenciales).pipe(
      tap((response) => {
        if (response.exito && !response.requiereActivacion) {
          this.almacenarSesion(response.token);
        }
      })
    );
  }

  private almacenarSesion(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.usuarioSubject.next(payload[this.CLAIM_EMAIL]);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  estaAutenticado(): boolean {
    const token = this.getToken();
    return !!token && !tokenExpirado(token);
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.usuarioSubject.next(null);
    this.router.navigate(['/iniciar-sesion']);
  }

  getEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.email = payload[this.CLAIM_EMAIL];
      return this.email;
    } catch {
      return null;
    }
  }


  registrarUsuario(dto: RegistroDTO): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/registro`, dto);
  }
}

