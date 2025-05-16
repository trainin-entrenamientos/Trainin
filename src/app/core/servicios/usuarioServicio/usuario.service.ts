import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/Usuario';
import { Observable, of } from 'rxjs';
import { LoginResponseDTO } from '../../modelos/LoginResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    //return this.http.get(`http://localhost:8080/usuario/${id}`);
    return of(new Usuario(id, "Juan", "Pérez", "juan@gmail.com", "contraseña123", true));
  }

  /*iniciarSesion(usuario:LoginDTO){
    return this.http.post("http://localhost:5010/api/usuario/login", usuario);
  }*/

    iniciarSesion(usuario:LoginResponseDTO){
    return this.http.post("http://localhost:5010/api/usuario/login", usuario);
  }
}
