import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl = environment.URL_BASE;

  constructor(private http: HttpClient) {}
  obtenerUsuarioPorEmail(email: string | null): Observable<RespuestaApi<UsuarioDTO>> {
    return this.http.get<RespuestaApi<UsuarioDTO>>(`${this.baseUrl}/usuario/obtener/${email}`);
  }

}
