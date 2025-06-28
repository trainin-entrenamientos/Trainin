import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginData } from '../../modelos/LoginResponseDTO';
import { RegistroDTO } from '../../modelos/RegistroDTO';
import { TokenUtils } from '../../utilidades/token-utils';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly ROL = 'rol';
  private CLAIM_EMAIL =
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
  private CLAIM_ROLE =
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  private usuarioSubject = new BehaviorSubject<string | null>(null);
  private baseUrl = environment.URL_BASE;
  email: string | null = null;
  private rolSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token && !TokenUtils.tokenExpirado(token)) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.usuarioSubject.next(payload[this.CLAIM_EMAIL]);
      this.rolSubject.next(payload[this.CLAIM_ROLE]);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
      this.usuarioSubject.next(null);
      this.rolSubject.next(null);
    }
  }

  get usuario() {
    return this.usuarioSubject.asObservable();
  }

  login(credenciales: {email: string; contrasenia: string;}): Observable<RespuestaApi<LoginData>> {
    return this.http
      .post<RespuestaApi<LoginData>>(`${this.baseUrl}/usuario/iniciarSesion`, credenciales)
      .pipe(
        tap((response) => {
          if (response.objeto.exito && !response.objeto.requiereActivacion) {
            this.almacenarSesion(response.objeto);
          }
        })
      );
  }

  private almacenarSesion(objeto: any) {
    localStorage.setItem(this.ROL, objeto.rol);
    localStorage.setItem(this.TOKEN_KEY, objeto.token);
    const payload = JSON.parse(atob(objeto.token.split('.')[1]));
    this.usuarioSubject.next(payload[this.CLAIM_EMAIL]);
    this.rolSubject.next(payload[this.CLAIM_ROLE]);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

 estaAutenticado(): boolean {
    const token = this.getToken();
    return !!token && !TokenUtils.tokenExpirado(token);
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROL);
    this.usuarioSubject.next(null);
    this.rolSubject.next(null);
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

  get rol$() {
    return this.rolSubject.asObservable();
  }

  registrarUsuario(dto: RegistroDTO): Observable<RespuestaApi<string>> {
    return this.http.post<RespuestaApi<string>>(`${this.baseUrl}/usuario/registro`, dto);
  }

  getRol(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload[this.CLAIM_ROLE];
    } catch {
      return null;
    }
  }
}
