import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ejercicio } from '../../modelos/Ejercicio';
import { Categoria } from '../../../compartido/enums/Categoria';
import { TipoEjercicio } from '../../../compartido/enums/TipoEjercicio';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  ejercicios: Ejercicio[] = [
    new Ejercicio(
      1,
      'Sentadilla',
      Categoria.FullBody,
      TipoEjercicio.Repeticion
    ),
    new Ejercicio(2, 'Plancha', Categoria.FullBody, TipoEjercicio.Tiempo),
    new Ejercicio(
      3,
      'Abdominales',
      Categoria.TrenSuperior,
      TipoEjercicio.Repeticion
    ),
    new Ejercicio(
      4,
      'Flexiones',
      Categoria.TrenSuperior,
      TipoEjercicio.Repeticion
    ),
    new Ejercicio(
      5,
      'Elevación de Talones',
      Categoria.TrenInferior,
      TipoEjercicio.Repeticion
    ),
    new Ejercicio(
      6,
      'Press Militar',
      Categoria.TrenSuperior,
      TipoEjercicio.Repeticion
    ),
    new Ejercicio(
      7,
      'Elevación de Piernas',
      Categoria.TrenInferior,
      TipoEjercicio.Repeticion
    ),
  ];

  private baseUrl = environment.URL_BASE;

  constructor(private http: HttpClient) { }

  obtenerEjercicios(): Observable<Ejercicio[]> {
    //return this.http.get<Ejercicio[]>(`${this.baseUrl}ejercicios`);

    return of(this.ejercicios);
  }

  eliminarEjercicio(id: number): Observable<boolean> {
    //return this.http.delete<void>(`${this.baseUrl}ejercicios/${id}`);
    return of(true);
  }

  crearEjercicio(ejercicio: Ejercicio): Observable<Ejercicio | null> {
    //return this.http.post<Ejercicio>(`${this.baseUrl}ejercicios`, ejercicio);

    if (!ejercicio) {
      console.error('Ejercicio no válido');
      return of(null);
    }

    let id = this.ejercicios.length;
    ejercicio.id = id + 1;

    this.ejercicios.push(ejercicio);

    return of(ejercicio);
  }

  obtenerEjercicioPorId(id: number): Observable<Ejercicio | null> {
    //return this.http.get<Ejercicio>(`${this.baseUrl}ejercicios/${id}`);

    const ejercicio = this.ejercicios.find((ejercicio) => ejercicio.id === +id);
    if (!ejercicio) {
      return of(null);
    }

    return of(ejercicio);
  }

  editarEjercicio(ejercicioEditado: Ejercicio): Observable<Ejercicio | null> {
    //return this.http.put<Ejercicio>(`${this.baseUrl}ejercicios/${ejercicioEditado.id}`, ejercicioEditado);

    const index = this.ejercicios.findIndex(
      (ejercicio) => +ejercicio.id === +ejercicioEditado.id
    );

    if (index !== -1) {
      this.ejercicios[index] = ejercicioEditado;
      return of(ejercicioEditado);
    } else {
      console.error('Ejercicio no encontrado para editar.');
      return of(null);
    }
  }
}
