import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Ejercicio {
  id: number;
  nombre: string;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class RutinaService {

  constructor() { }


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
  }}
