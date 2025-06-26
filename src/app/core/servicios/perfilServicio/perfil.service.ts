import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PerfilDTO } from '../../modelos/PerfilDTO';
import { UsuarioEditado } from '../../modelos/UsuarioEditadoDTO';
import { CambiarContraseniaDTO } from '../../modelos/CambiarContraseniaDTO';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';

@Injectable({ providedIn: 'root' })
export class PerfilService {
private apiUrl = `${environment.URL_BASE}/usuario/`;

  constructor(private http: HttpClient) {}

getPerfil(email: string): Observable<any> {
  return this.http.get(`${this.apiUrl}perfil/${encodeURIComponent(email)}`);
}

actualizarFotoPerfil(email: string, fotoBase64: string) {
  return this.http.patch(`${this.apiUrl}perfil/`, { email, fotoBase64 });
}

editarPerfil(usuario: UsuarioEditado) {
  return this.http.patch(`${this.apiUrl}editarPerfil`, usuario);
}

cambiarContrasenia(dto: CambiarContraseniaDTO): Observable<RespuestaApi<string>> {
    return this.http.patch<RespuestaApi<string>>(
      `${this.apiUrl}cambiarContrasenia`,
      dto
    );
  }

}
