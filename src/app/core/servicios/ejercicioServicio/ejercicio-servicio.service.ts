import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EjercicioIncorporadoDTO } from '../../modelos/EjercicioIncorporadoDTO';
import { EjercicioEditadoDTO } from  '../../modelos/EjercicioEditadoDTO';

@Injectable({
  providedIn: 'root'
})
export class EjercicioService {
  private readonly baseUrl = '/api/Ejercicios';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<EjercicioIncorporadoDTO[]> {
    return this.http.get<EjercicioIncorporadoDTO[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<EjercicioIncorporadoDTO> {
    return this.http.get<EjercicioIncorporadoDTO>(`${this.baseUrl}/${id}`);
  }

  crear(dto: EjercicioIncorporadoDTO): Observable<EjercicioIncorporadoDTO> {
    return this.http.post<EjercicioIncorporadoDTO>(this.baseUrl, dto);
  }

  actualizar(id: number, dto: EjercicioEditadoDTO): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
