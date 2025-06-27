import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ActualizarNivelExigenciaDTO } from '../../modelos/ActualizarNivelExigenciaDTO';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';
import { PlanEntrenamiento } from '../../modelos/PlanEntrenamiento';
import { CategoriaEjercicioDTO } from '../../modelos/CategoriaEjercicioDTO';
import { Equipamiento } from '../../../compartido/interfaces/Equipamiento';
import { EquipamientoDTO } from '../../modelos/EquipamentoDTO';
import { PlanCreadoDTO } from '../../modelos/PlanCreadoDTO';
import { PlanCompleto } from '../../modelos/DetallePlanDTO';
import { HistorialPlanDTO } from '../../modelos/HistorialPlanDTO';

@Injectable({
  providedIn: 'root',
})
export class PlanEntrenamientoService {
  private baseUrl = environment.URL_BASE;

  constructor(private http: HttpClient) {}

  getPlanesDeEntrenamiento(id: number): Observable<RespuestaApi<PlanEntrenamiento[]>> {
    return this.http.get<RespuestaApi<PlanEntrenamiento[]>>(`${this.baseUrl}/plan/obtener/${id}`);
  }

  obtenerOpcionesEntrenamiento(): Observable<RespuestaApi<CategoriaEjercicioDTO[]>>{
    return this.http.get<RespuestaApi<CategoriaEjercicioDTO[]>>(`${this.baseUrl}/ejercicio/obtenerCategorias`);
  }

  obtenerEquipamiento(): Observable<RespuestaApi<EquipamientoDTO[]>> {
    return this.http.get<RespuestaApi<EquipamientoDTO[]>>(`${this.baseUrl}/ejercicio/obtenerEquipamientos`);
  }

  crearPlanEntrenamiento(planEntrenamiento: any): Observable<RespuestaApi<PlanCreadoDTO>> {
    return this.http.post<RespuestaApi<PlanCreadoDTO>>(`${this.baseUrl}/plan/crear`, planEntrenamiento);
  }

  desactivarPlanPorId(idPlan: number, idUsuario: number): Observable<RespuestaApi<string>> {
    return this.http.patch<RespuestaApi<string>>(`${this.baseUrl}/plan/desactivar/${idPlan}`, {
      IdUsuario: idUsuario,
    });
  }

  actualizarNivelExigencia(idPlan: number, formulario: ActualizarNivelExigenciaDTO): Observable<RespuestaApi<string>> {
    return this.http.patch<RespuestaApi<string>>(`${this.baseUrl}/plan/actualizar/${idPlan}`, formulario);
  }

  obtenerDetallePlan(idPlan: number, idUsuario: number): Observable<RespuestaApi<PlanCompleto>> {
    return this.http.get<RespuestaApi<PlanCompleto>>(
      `${this.baseUrl}/plan/detalle/${idPlan}?IdUsuario=${idUsuario}`
    );
  }

  obtenerHistorialPlanes(email: string): Observable<RespuestaApi<HistorialPlanDTO[]>> {
    return this.http.get<RespuestaApi<HistorialPlanDTO[]>>(`${this.baseUrl}/plan/historial/${email}`);
  }
}
