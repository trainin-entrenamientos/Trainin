import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/Usuario';
import { Observable, of } from 'rxjs';
import { LoginResponseDTO } from '../../modelos/LoginResponseDTO';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = environment.URL_BASE;

  constructor(private http: HttpClient) { }

  obtenerUsuarioPorId(email: string | null): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuario/obtenerPorEmail/${email}`);
  }

  iniciarSesion(usuario:LoginResponseDTO){
    return this.http.post(`${this.baseUrl}/usuario/login`, usuario);
  }
}
