import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rutina } from '../../modelos/RutinaDTO';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RutinaService {
  private rutina: Rutina | null = null;
  private indiceActual: number = 0;

  constructor(private http: HttpClient) {}

  getDetalleEjercicios(planId: number): Observable<Rutina> {
    return this.http.get<Rutina>(
      `http://localhost:5010/api/rutina/obtenerPorPlan/${planId}`
    );
  }

  fueRealizada(idRutina: number, email: string): Observable<any> {
    return this.http.patch<any>(
      `http://localhost:5010/api/rutina/fueRealizada/${idRutina}`,
      { email }
    );
  }

  setRutina(rutinaObtenida: Rutina) {
    this.rutina = rutinaObtenida;
  }

  getRutina(): Rutina | null {
    return this.rutina;
  }

  setIndiceActual(i: number) {
    this.indiceActual = i;
  }

  getIndiceActual(): number {
    return this.indiceActual;
  }
}