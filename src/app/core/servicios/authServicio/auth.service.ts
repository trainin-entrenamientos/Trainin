import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponseDTO } from '../../modelos/LoginResponseDTO';
import { RegistroDTO } from '../../modelos/RegistroDTO';


interface Usuario {
  id: number;
  email: string;
}

interface AuthResponse {
  token: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5010/api/Usuario';
  private usuarioSignal = signal<string | null>(null);
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.cargarUsuario();
  }

  get usuario() {
    return this.usuarioSignal();
  }

  private cargarUsuario() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.usuarioSignal.set(JSON.parse(usuario));
    }
  }

 login(credenciales: { email: string, contrasenia: string }) {
  return this.http.post<LoginResponseDTO>('http://localhost:5010/api/Usuario/login', credenciales);
}


  registro(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/registro`, { email, password })
      .pipe(
        tap(response => this.almacenarSesion(response))
      );
  }

  private almacenarSesion(response: AuthResponse) {
    localStorage.removeItem('token');
    localStorage.setItem('token', response.token);
    localStorage.setItem('usuario', JSON.stringify(response.email));
    this.usuarioSignal.set(response.email);
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioSignal.set(null);
    this.router.navigate(['/login']);
  }

  estaAutenticado(): boolean {
  const token = this.getToken();
  return !!token;  
}


  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  registrarUsuario(dto: RegistroDTO): Observable<string> {
      return this.http.post<string>(`${this.API_URL}/registro`, dto);
    }

  getEmail(): string | null {
    const usuario = localStorage.getItem("email");
    return usuario;
  }
}