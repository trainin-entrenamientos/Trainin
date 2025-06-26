import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VerificacionCorreoService {
  private apiUrl = `${environment.URL_BASE}/usuario/activar/`;

  constructor(private http: HttpClient) {}

  confirmarEmail(token: string) {
    return this.http.get<any>(this.apiUrl + token);
  }
}