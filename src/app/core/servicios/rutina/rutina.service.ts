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

  constructor(private http:HttpClient){

   }


  ObtenerEjercicios(): Observable<Ejercicio[]> {
    const ejercicios: Ejercicio[] = [
    {id:1, nombre: 'Abdominales', imagen: '/imagenes/abdominales.jpg'},
    {id:2, nombre: 'Flexiones', imagen: '/imagenes/Flexiones.jpeg'},
    {id:3, nombre: 'Sentadillas', imagen: '/imagenes/Sentadilla.jpg'},
    {id:4, nombre: 'Plancha', imagen: '/imagenes/plancha.jpg'},
    {id:5, nombre: 'Abdominales', imagen: '/imagenes/abdominales.jpg'},
    {id:6, nombre: 'Flexiones', imagen: '/imagenes/Flexiones.jpeg'},
  ];
  
    return of(ejercicios);
  }

getDetalleEjercicios(planId: number): Observable<Rutina[]> {
  return this.http.get<Rutina[]>(
    `http://localhost:5010/api/rutina/obtenerPorPlan/${planId}`
  );
}


  private rutina: Rutina | null = null;

  setRutina(rutina: Rutina) {
    this.rutina = rutina;
  }

  getRutina(): Rutina | null {
    return this.rutina;
  }

  clearRutina() {
    this.rutina = null;
  }



}
