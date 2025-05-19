import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rutina } from '../../modelos/RutinaDTO';

@Injectable({
  providedIn: 'root'
})
export class InicioRutinaService {

  private readonly API_URL = 'http://localhost:5010/api/rutina/obtenerPorPlan';

  constructor(private http: HttpClient) {}

    obtenerRutina(idPlan:number): Observable<Rutina> {
      return this.http.get<Rutina>(`${this.API_URL}/${idPlan}`);
    }
}
