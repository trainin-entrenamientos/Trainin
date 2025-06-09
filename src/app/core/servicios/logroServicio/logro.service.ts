import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Logro } from '../../modelos/LogroDTO';
 
@Injectable({
  providedIn: 'root'
})
export class LogroService {
 
  private logroSubject = new Subject<{ nombre: string; imagen: string }>();
  logroNotificaciones$ = this.logroSubject.asObservable();

  private baseUrl = environment.URL_BASE;

  constructor(private http: HttpClient) { }

  mostrarLogro(logro: Logro) {
    const nombre= logro.nombre;
    const imagen= logro.imagen;
    
    this.logroSubject.next({ nombre, imagen });
  }

   obtenerLogrosPorUsuario(email:string | null): Observable<any> {
      return this.http.get(`${this.baseUrl}/usuario/obtenerLogros/${email}`);
    }

   obtenerTodosLosLogros(): Observable<any> {
      return this.http.get(`${this.baseUrl}/logro/obtenerLogros`);
    }
}
