import { Injectable, NgModule } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Rutina } from '../../modelos/RutinaDTO';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
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

  setRutina(r: Rutina) {
    this.rutina = r;
    localStorage.setItem('rutina', JSON.stringify(r));
  }

  getRutina(): Rutina | null {
    if (this.rutina) return this.rutina;
    const raw = localStorage.getItem('rutina');
    if (raw) {
      this.rutina = JSON.parse(raw);
      return this.rutina;
    }
    return null;
  }

  setIndiceActual(i: number) {
    this.indiceActual = i;
    localStorage.setItem('indiceActual', i.toString());
  }

  getIndiceActual(): number {
    if (this.indiceActual) return this.indiceActual;
    const raw = localStorage.getItem('indiceActual');
    if (raw) {
      this.indiceActual = parseInt(raw);
      return this.indiceActual;
    }
    return 0;
  }
}