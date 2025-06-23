import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RetoService {
  private baseUrl = environment.URL_BASE;
  
  constructor(private http: HttpClient) { }
  
  obtenerRetoPorIdUsuario(idUsuario : number) {
    return this.http.get(`${this.baseUrl}/reto/obtener/${idUsuario}`);
  }
  
  completarReto(id: number, idUsuario: number) {
    throw new Error('Method not implemented.');
  }
}
