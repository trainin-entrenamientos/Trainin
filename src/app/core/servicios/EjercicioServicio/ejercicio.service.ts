import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { EjercicioIncorporadoDTO } from '../../modelos/EjercicioIncorporadoDTO';
import { environment } from '../../../../environments/environment.prod';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';
import { CategoriaEjercicioDTO } from '../../modelos/CategoriaEjercicioDTO';
import { GrupoMuscular } from '../../modelos/DetallePlanDTO';
import { GrupoMuscularDTO } from '../../modelos/GrupoMuscularDTO';
import { EjercicioDiarioDTO } from '../../modelos/EjercicioDiarioDTO';

@Injectable({ providedIn: 'root' })
export class EjercicioService {
  [x: string]: any;

  private apiUrl = `${environment.URL_BASE}/ejercicio`;

  constructor(private http: HttpClient) { }

  obtenerTodosLosEjercicios(): Observable<RespuestaApi<EjercicioIncorporadoDTO[]>> {
    return this.http.get<RespuestaApi<EjercicioIncorporadoDTO[]>>(
        `${this.apiUrl}/obtener`
      )
  }

  obtenerEjercicioPorId(id: number): Observable<RespuestaApi<EjercicioIncorporadoDTO>> {
    return this.http.get<RespuestaApi<EjercicioIncorporadoDTO>>(
        `${this.apiUrl}/obtener/${id}`
      )
  }

  crearEjercicio(dto: EjercicioIncorporadoDTO): Observable<RespuestaApi<string>> {
    return this.http.post<RespuestaApi<string>>(`${this.apiUrl}/agregar`, dto)
  }

  editarEjercicio(id: number, dto: EjercicioIncorporadoDTO): Observable<RespuestaApi<string>> {
    return this.http.patch<RespuestaApi<string>>(
      `${this.apiUrl}/editar`, dto)
  }

  eliminarEjercicio(id: number): Observable<RespuestaApi<string>> {
    return this.http.delete
    <RespuestaApi<string>>(`${this.apiUrl}/eliminar/${id}` )
  }

  obtenerCategorias(): Observable<RespuestaApi<CategoriaEjercicioDTO[]>>
  {
    return this.http.get<RespuestaApi<CategoriaEjercicioDTO[]>>(
        `${this.apiUrl}/obtenerCategorias`)
  }

  obtenerGruposMusculares(): Observable<RespuestaApi<GrupoMuscularDTO[]>> {
    return this.http.get<RespuestaApi<GrupoMuscularDTO[]>>(
        `${this.apiUrl}/obtenerGruposMusculares`
      )
  }
  obtenerEjercicioDiario(email: string): Observable<RespuestaApi<EjercicioDiarioDTO>> {
    return this.http.get<RespuestaApi<EjercicioDiarioDTO>>(`${this.apiUrl}/diario/${email}`)
  }

   marcarEjercicioDiarioRealizado(emailUsuario: string): Observable<RespuestaApi<string>> {
    return this.http.get<RespuestaApi<string>>(`${this.apiUrl}/DiarioCompletado/${emailUsuario}`);
  }

}