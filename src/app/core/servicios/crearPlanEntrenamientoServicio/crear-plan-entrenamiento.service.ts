import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PlanEntrenamiento } from '../../modelos/PlanEntrenamiento';

@Injectable({
  providedIn: 'root'
})
export class CrearPlanEntrenamientoService {

  constructor(private http: HttpClient) { }

  getPlanesDeEntrenamiento(id: number): Observable<PlanEntrenamiento> {
    //return this.http.get(`http://localhost:8080/plan-entrenamiento/${id}`);
    return of(new PlanEntrenamiento(1, "Cuerpo completo", false, 0, 1, id, 1, 5, 45));
  }

  obtenerOpcionesEntrenamiento(): Observable<any> {
    return this.http.get('http://localhost:5010/api/CategoriaEjercicio/obtenerCategorias');
  }

  obtenerEquipamiento(): Observable<any> {
    return this.http.get('http://localhost:5010/api/Equipamiento/obtenerEquipamientos');
  }

  crearPlanEntrenamiento(planEntrenamiento: any): Observable<any> {
    return this.http.post('http://localhost:5010/api/Plan/crearPlan', planEntrenamiento);
  }
}