import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PlanEntrenamiento } from '../../modelos/PlanEntrenamiento';

@Injectable({
  providedIn: 'root'
})
export class CrearPlanEntrenamientoService {

  constructor(private http: HttpClient) { }

  getPlanesDeEntrenamiento(id: number): Observable<any> {
    return this.http.get(`http://localhost:5010/api/Plan/obtenerPlanes/${id}`);
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