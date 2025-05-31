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
    return this.http.get(`${this.baseUrl}/Usuario/obtenerUsuario/${email}`);
  }

  /*iniciarSesion(usuario:LoginDTO){
    return this.http.post("http://localhost:5010/api/usuario/login", usuario);
  }*/

    iniciarSesion(usuario:LoginResponseDTO){
    return this.http.post("${this.baseUrl}/usuario/login", usuario);
  }
}
