import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EjercicioIncorporadoDTO } from '../../modelos/EjercicioIncorporadoDTO';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EjercicioService {
  private baseUrl = `${environment.URL_BASE}/ejercicios`;

  constructor(private http: HttpClient) { }

  obtenerTodosLosEjercicios(): Observable<EjercicioIncorporadoDTO[]> {
    return this.http.get<EjercicioIncorporadoDTO[]>(`${this.baseUrl}/obtenerEjercicios`);
  }

  crearEjercicio(dto: EjercicioIncorporadoDTO): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.baseUrl}/agregarEjercicio`, dto);
  }

  editarEjercicio(id: number, dto: EjercicioIncorporadoDTO): Observable<boolean> {
    return this.http.patch<boolean>(`${this.baseUrl}/editarEjercicio/${id}`, dto);
  }

  eliminarEjercicio(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/${id}`);
  }

  obtenerEjercicioPorId(id: number): Observable<EjercicioIncorporadoDTO> {
    return this.http.get<EjercicioIncorporadoDTO>(`${this.baseUrl}/${id}`);
  }

    listarCategoriasEjercicio(): Observable<CategoriaEjercicio[]> {
    return this.http.get<CategoriaEjercicio[]>(`${this.apiUrl}/categorias`);
  }

   listarGruposMusculares(): Observable<GrupoMuscular[]> {
    return this.http.get<GrupoMuscular[]>(`${this.apiUrl}/grupos-musculares`);
  }

}
