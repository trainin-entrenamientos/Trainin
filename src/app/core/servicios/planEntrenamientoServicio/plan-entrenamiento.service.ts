import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanEntrenamientoService {

  private baseUrl = environment.URL_BASE;

  constructor(private http: HttpClient) { }

  getPlanesDeEntrenamiento(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Plan/obtenerPlanes/${id}`);
  }

  obtenerOpcionesEntrenamiento(): Observable<any> {
    return this.http.get('${this.baseUrl}/categoriaejercicio/obtenerCategorias');
  }

  obtenerEquipamiento(): Observable<any> {
    return this.http.get('${this.baseUrl}/equipamiento/obtenerEquipamientos');
  }

  crearPlanEntrenamiento(planEntrenamiento: any): Observable<any> {
    return this.http.post('${this.baseUrl}/plan/crearPlan', planEntrenamiento);
  }

  desactivarPlanPorId(idPlan: number, idUsuario: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/Plan/desactivarPlan/${idPlan}`, { idUsuario });
  }
}