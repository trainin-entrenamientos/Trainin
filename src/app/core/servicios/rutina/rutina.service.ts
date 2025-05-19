import { Injectable, NgModule } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Rutina } from '../../modelos/RutinaDTO';
import { HttpClient } from '@angular/common/http';

export interface Ejercicio {
  id: number;
  nombre: string;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class RutinaService {
  private rutina: Rutina | null = null;

  constructor(private http: HttpClient) {}

  getDetalleEjercicios(planId: number): Observable<Rutina> {
    return this.http.get<Rutina>(
      `http://localhost:5010/api/rutina/obtenerPorPlan/${planId}`
    );
  }

  setRutina(rutina: Rutina) {
    this.rutina = rutina;
    localStorage.setItem('rutina', JSON.stringify(rutina));
  }

  getRutina(): Rutina | null {
    if (!this.rutina) {
      const rutinaGuardada = localStorage.getItem('rutina');
      if (rutinaGuardada) {
        this.rutina = JSON.parse(rutinaGuardada);
      }
    }
    return this.rutina;
  }

  getEjercicios(): Ejercicio[] {
    return this.rutina?.ejercicios || [];
  }

  clearRutina() {
    this.rutina = null;
    localStorage.removeItem('rutina');
  }
}