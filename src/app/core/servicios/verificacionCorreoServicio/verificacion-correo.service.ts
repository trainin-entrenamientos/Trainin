import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';

@Injectable({ providedIn: 'root' })
export class VerificacionCorreoService {
  private apiUrl = `${environment.URL_BASE}/usuario/activar/`;

  constructor(private http: HttpClient) {}

  confirmarEmail(token: string): Observable<RespuestaApi<boolean>> {
    return this.http.get<RespuestaApi<boolean>>(this.apiUrl + token);
  }
}