import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { EjercicioIncorporadoDTO } from '../../modelos/EjercicioIncorporadoDTO';
import { environment } from '../../../../environments/environment.prod';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';

@Injectable({ providedIn: 'root' })
export class EjercicioService {
  [x: string]: any;

  private apiUrl = `${environment.URL_BASE}/ejercicio`;

  constructor(private http: HttpClient) { }

  obtenerTodosLosEjercicios(): Observable<EjercicioIncorporadoDTO[]> {
    return this.http
      .get<RespuestaApi<EjercicioIncorporadoDTO[]>>(
        `${this.apiUrl}/obtener`
      )
      .pipe(map(res => res.objeto));
  }

  obtenerEjercicioPorId(id: number): Observable<EjercicioIncorporadoDTO> {
    return this.http
      .get<RespuestaApi<EjercicioIncorporadoDTO>>(
        `${this.apiUrl}/obtener/${id}`
      )
      .pipe(map(res => res.objeto));
  }

  crearEjercicio(dto: EjercicioIncorporadoDTO): Observable<string> {
    return this.http
      .post<RespuestaApi<string>>(`${this.apiUrl}/agregar`, dto)
      .pipe(map(res => res.mensaje));
  }

  editarEjercicio(id: number, dto: EjercicioIncorporadoDTO): Observable<string> {
    return this.http
      .patch<RespuestaApi<string>>(
        `${this.apiUrl}/editar/${id}`, dto
      )
      .pipe(map(res => res.mensaje));
  }

  eliminarEjercicio(id: number): Observable<string> {
    return this.http
      .delete<RespuestaApi<string>>(
        `${this.apiUrl}/eliminar/${id}`
      )
      .pipe(map(res => res.mensaje));
  }

  obtenerCategorias(): Observable<any[]> {
    return this.http
      .get<RespuestaApi<any[]>>(
        `${environment.URL_BASE}/categoriaEjercicio/obtener`
      )
      .pipe(map(res => res.objeto));
  }

  obtenerGruposMusculares(): Observable<any[]> {
    return this.http
      .get<RespuestaApi<any[]>>(
        `${environment.URL_BASE}/grupoMuscular/obtener`
      )
      .pipe(map(res => res.objeto));
  }
  obtenerEjercicioDiario(email: string): Observable<any> {
    return this.http.get<RespuestaApi<any[]>>(`${this.apiUrl}/diario/${email}`).pipe(map(res => res.objeto));
  }
   marcarEjercicioDiarioRealizado(emailUsuario: string) {
    return this.http.get(`${this.apiUrl}/DiarioCompletado/${emailUsuario}`);
  }

}