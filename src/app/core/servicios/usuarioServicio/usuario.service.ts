import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';

import { ReestablecerContraseniaDTO } from '../../modelos/ReestablecerContraseniaDTO';


import { Usuario } from '../../modelos/Usuario';
 

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl = environment.URL_BASE;
    
  constructor(private http: HttpClient) {}
  obtenerUsuarioPorEmail(email: string | null): Observable<RespuestaApi<Usuario>> {
    return this.http.get<RespuestaApi<Usuario>>(`${this.baseUrl}/usuario/obtener/${email}`);
  }
 
  olvidarContrasenia(email: string): Observable<RespuestaApi<string>> {
    return this.http.post<RespuestaApi<string>>(
      `${this.baseUrl}/usuario/olvidasteContrasenia`,
      { email }
    );
  }

  reestablecerContrasenia(
    dto: ReestablecerContraseniaDTO
  ): Observable<RespuestaApi<string>> {
    return this.http.post<RespuestaApi<string>>(
      `${this.baseUrl}/usuario/reestablecerContrasenia`, dto
    );
  }

}
 