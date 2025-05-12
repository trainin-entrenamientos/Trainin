import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../modelos/Usuario';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    //return this.http.get(`http://localhost:8080/usuario/${id}`);
    return of(new Usuario(id, "Juan", "Pérez", "juan@gmail.com", "contraseña123", true));
  }
}
