import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ActualizarNivelExigenciaDTO } from '../../modelos/ActualizarNivelExigenciaDTO';

@Injectable({
  providedIn: 'root'
})
export class PlanEntrenamientoService {

  private baseUrl = environment.URL_BASE;

  constructor(private http: HttpClient) { }

  getPlanesDeEntrenamiento(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/plan/obtenerPlanes/${id}`);
  }

  obtenerOpcionesEntrenamiento(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categoriaejercicio/obtenerCategorias`);
  }

  obtenerObjetivos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categoriaejercicio/obtenerObjetivos`);
  }

  obtenerEquipamiento(): Observable<any> {
    return this.http.get(`${this.baseUrl}/equipamiento/obtenerEquipamientos`);
  }

  crearPlanEntrenamiento(planEntrenamiento: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/plan/crearPlan`, planEntrenamiento);
  }

  desactivarPlanPorId(idPlan: number, idUsuario: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/plan/desactivarPlan/${idPlan}`, { idUsuario });
  }

  actualizarNivelExigencia(idPlan: number, formulario: ActualizarNivelExigenciaDTO): Observable<string> {
    return this.http.patch(`${this.baseUrl}/plan/actualizarNivelExigencia/${idPlan}`, formulario, { responseType: 'text' });
  }

  obtenerDetallePlan(idPlan: number, idUsuario: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/plan/obtenerDetallePlan/${idPlan}?idUsuario=${idUsuario}`);
  }
 
}