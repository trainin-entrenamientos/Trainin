import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ejercicio } from '../../modelos/Ejercicio';
import { Categoria } from '../../../compartido/enums/Categoria';
import { TipoEjercicio } from '../../../compartido/enums/TipoEjercicio';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  obtenerEjercicios(): Observable<Ejercicio[]> {
    //return this.http.get<Ejercicio[]>('http://localhost:3000/ejercicios');

    return of ([
      new Ejercicio(1, 'Sentadilla', Categoria.FullBody, TipoEjercicio.Repeticion),
      new Ejercicio(2, 'Plancha ', Categoria.FullBody, TipoEjercicio.Tiempo),
      new Ejercicio(3, 'Abdominales', Categoria.TrenSuperior, TipoEjercicio.Repeticion),
      new Ejercicio(4, 'Flexiones', Categoria.TrenSuperior, TipoEjercicio.Repeticion),
      new Ejercicio(5, 'Elevación de Talones', Categoria.TrenInferior, TipoEjercicio.Repeticion),
      new Ejercicio(6, 'Press Militar', Categoria.TrenSuperior, TipoEjercicio.Repeticion),
      new Ejercicio(7, 'Elevación de Piernas', Categoria.TrenInferior, TipoEjercicio.Repeticion),
    ]);
  }

  eliminarEjercicio(id: number): Observable<boolean> {
    //return this.http.delete<void>(`http://localhost:3000/ejercicios/${id}`);
    return of (true);
  }
}