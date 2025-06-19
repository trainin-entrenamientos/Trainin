import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rutina } from '../../modelos/RutinaDTO';
import { HttpClient } from '@angular/common/http';
import { Ejercicio } from '../../modelos/RutinaDTO';
import { environment } from '../../../../environments/environment';
import { NombreEjercicio } from '../../../compartido/enums/nombre-ejercicio.enum';


@Injectable({
  providedIn: 'root',
})
export class RutinaService {
 
  private rutina: Rutina | null = null;
  private indiceActual: number = 0;
  private baseUrl = environment.URL_BASE;

  constructor(private http: HttpClient) {
  }

  getDetalleEjercicios(planId: number): Observable<Rutina> {
    return this.http.get<Rutina>(
      `${this.baseUrl}/rutina/obtenerPorPlan/${planId}`
    );
  }

  fueRealizada(idRutina: number, email: string, segundosTotales: number): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/rutina/fueRealizada/${idRutina}`,
      { email, segundosTotales }
    );
  }

  setRutina(rutinaObtenida: Rutina) {
    this.rutina = rutinaObtenida;
    sessionStorage.setItem('rutina', JSON.stringify(rutinaObtenida));
  }

  getRutina(): Rutina | null {
    return this.rutina;
  }


  cargarDesdeSession(): void {
  const rutinaGuardada = sessionStorage.getItem('rutina');
  const indiceGuardado = sessionStorage.getItem('indiceActual');

  if (rutinaGuardada) {
    this.rutina = JSON.parse(rutinaGuardada);
  }

  if (indiceGuardado !== null) {
    this.indiceActual = +indiceGuardado;
  }
}

  limpiarRutina() {
    this.rutina = null;
    this.indiceActual = 0;
    sessionStorage.removeItem('rutina');
    sessionStorage.removeItem('indiceActual');
  }

  setIndiceActual(i: number) {
    this.indiceActual = i;
    sessionStorage.setItem('indiceActual', i.toString());
  }
  
  getIndiceActual(): number {
    return this.indiceActual;
  }
  
  avanzarAlSiguienteEjercicio(): void {
  if (this.rutina && this.indiceActual < this.rutina.ejercicios.length) {
    this.indiceActual++;
    sessionStorage.setItem('indiceActual', this.indiceActual.toString());
  }
}
  getEjercicioActual(): Ejercicio | null {
    if(!this.rutina || this.indiceActual >= this.rutina.ejercicios.length) {
      return null; 
    }
    return this.rutina.ejercicios[this.indiceActual];
  }

  
  haySiguienteEjercicio(): boolean {
    return this.indiceActual < this.rutina?.ejercicios.length!;
  }

  getDatosIniciales() {
  const rutina = this.getRutina();
  const indice = this.getIndiceActual();
  const ejercicios = rutina?.ejercicios || [];
  const ejercicio = ejercicios[indice] ?? null;

  const duracion = ejercicio?.duracion ? `${ejercicio.duracion} segundos` : '';
  const repeticiones = ejercicio?.repeticiones ? `${ejercicio.repeticiones} repeticiones` : '';

  return {
    rutina,
    indiceActual: indice,
    ejercicios,
    ejercicio,
    duracionDelEjercicio: duracion,
    repeticionesDelEjercicio: repeticiones,
    correccionPremium: ejercicio?.correccionPremium,
  };
  }

 buscarNombreEjercicio(nombre: string | undefined): NombreEjercicio | null {
  const mapa: Record<string, NombreEjercicio> = {
    'Press militar': NombreEjercicio.PRESS_MILITAR,
    'Vuelos laterales': NombreEjercicio.VUELOS_LATERALES,
    'Estocadas': NombreEjercicio.ESTOCADA,  
    'Sentadillas': NombreEjercicio.SENTADILLA,
    'Sentadilla búlgara': NombreEjercicio.SENTADILLA_BULGARA,
    'Curl de bíceps': NombreEjercicio.CURL_BICEPS,
    'Fondos con banco': NombreEjercicio.FONDOS_TRICEPS,
    'Zancadas laterales': NombreEjercicio.SENTADILLA_LATERAL,
    'Elevación de pierna lateral parado': NombreEjercicio.ABDUCCION_CADERA,
    'Jumping jacks': NombreEjercicio.SALTOS_TIJERA
  };

  return nombre && mapa[nombre] ? mapa[nombre] : null;
}

  
}