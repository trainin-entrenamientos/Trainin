import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { PerfilDTO } from '../../modelos/PerfilDTO';

@Injectable({ providedIn: 'root' })
export class PerfilService {
private apiUrl = `${environment.URL_BASE}usuario/`;

  constructor(private http: HttpClient) {}

getPerfil(email: string): Observable<any> {
  return this.http.get(`${this.apiUrl}perfil/${encodeURIComponent(email)}`);
}

  actualizarFotoPerfil(email: string, fotoBase64: string) {
    return this.http.patch(`${this.apiUrl}perfil/`, { email, fotoBase64 });
  }

}
