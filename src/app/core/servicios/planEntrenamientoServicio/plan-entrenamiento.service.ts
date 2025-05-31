import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanEntrenamientoService {
  constructor(private http: HttpClient) { }

  getPlanesDeEntrenamiento(id: number): Observable<any> {
    return this.http.get(`http://localhost:5010/api/Plan/obtenerPlanes/${id}`);
  }

  obtenerOpcionesEntrenamiento(): Observable<any> {
    return this.http.get('http://localhost:5010/api/categoriaejercicio/obtenerCategorias');
  }

  obtenerEquipamiento(): Observable<any> {
    return this.http.get('http://localhost:5010/api/equipamiento/obtenerEquipamientos');
  }

  crearPlanEntrenamiento(planEntrenamiento: any): Observable<any> {
    return this.http.post('http://localhost:5010/api/plan/crearPlan', planEntrenamiento);
  }

  desactivarPlanPorId(idPlan: number, idUsuario: number): Observable<any> {
    return this.http.patch(`http://localhost:5010/api/Plan/desactivarPlan/${idPlan}`, { idUsuario });
  }

  ActualizarNivelExigencia(idPlan: number, email: string | null , nivelExigencia: number | null): Observable<any> {
    return this.http.patch(`http://localhost:5010/api/plan/actualizarNivelExigencia/${idPlan}`, { nivelExigencia, email });
  }
}