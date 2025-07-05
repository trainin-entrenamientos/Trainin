import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LogroDTO } from '../../modelos/LogroDTO';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';
 
@Injectable({
  providedIn: 'root'
})
export class LogroService {
 
  private logroSubject = new Subject<{ nombre: string; imagen: string }>();
  logroNotificaciones$ = this.logroSubject.asObservable();

  private baseUrl = environment.URL_BASE;

  constructor(private http: HttpClient) { }

  mostrarLogro(logro: LogroDTO) {
    const nombre= logro.nombre;
    const imagen= logro.imagen;
    
    this.logroSubject.next({ nombre, imagen });
  }

   obtenerLogrosPorUsuario(email:string | null): Observable<RespuestaApi<LogroDTO[]>> {
      return this.http.get<RespuestaApi<LogroDTO[]>>(`${this.baseUrl}/usuario/obtenerLogros/${email}`);
    }

   obtenerTodosLosLogros(): Observable<RespuestaApi<LogroDTO[]>> {
      return this.http.get<RespuestaApi<LogroDTO[]>>(`${this.baseUrl}/logro/obtener`);
    }
}
