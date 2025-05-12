import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PlanEntrenamiento } from '../../modelos/PlanEntrenamiento'; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})
export class CrearPlanEntrenamientoService {

  constructor(private http: HttpClient) { }

  getPlanesDeEntrenamiento(id: number): Observable<PlanEntrenamiento> {
    //return this.http.get(`http://localhost:8080/plan-entrenamiento/${id}`);
    return of(new PlanEntrenamiento(1, "Cuerpo completo", true, 1, 1, id));
  }
}
