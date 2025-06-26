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
    return this.http.get(`${this.baseUrl}/plan/obtener/${id}`);
  }

  obtenerOpcionesEntrenamiento(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ejercicio/obtenerCategorias`);
  }
 //ESTO SE USA? 
  obtenerObjetivos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categoriaEjercicio/obtenerObjetivos`);
  }

  obtenerEquipamiento(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ejercicio/obtenerEquipamientos`);
  }

  crearPlanEntrenamiento(planEntrenamiento: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/plan/crear`, planEntrenamiento);
  }

  desactivarPlanPorId(idPlan: number, idUsuario: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/plan/desactivar/${idPlan}`, { IdUsuario: idUsuario });
  }

  actualizarNivelExigencia(idPlan: number, formulario: ActualizarNivelExigenciaDTO): Observable<any> {
    return this.http.patch(`${this.baseUrl}/plan/actualizar/${idPlan}`, formulario);
  }

  obtenerDetallePlan(idPlan: number, idUsuario: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/plan/detalle/${idPlan}?IdUsuario=${idUsuario}`);
  }

  obtenerHistorialPlanes(email: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/plan/historial/${email}`);
  }
 
}