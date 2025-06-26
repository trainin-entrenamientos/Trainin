import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginData } from '../../modelos/LoginResponseDTO';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl = environment.URL_BASE;

  constructor(private http: HttpClient) {}
  obtenerUsuarioPorEmail(email: string | null): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuario/obtener/${email}`);
  }

}
