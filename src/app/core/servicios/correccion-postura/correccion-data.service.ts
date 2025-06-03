import { Injectable } from '@angular/core';
import { DatosEjercicio } from '../../../compartido/interfaces/datos-ejercicio-correccion';

@Injectable({
  providedIn: 'root'
})
export class CorreccionDataService {

  private datosMap = new Map<string, DatosEjercicio>();
  
  constructor() { }

  /**
   * Registra un nuevo resultado para un ejercicio.
   * Si ya existían datos, compara el porcentaje y actualiza el máximo y los reintentos.
   */
  registrarResultado(
    nombreEjercicio: string,
    porcentajeObtenido: number,
    reintentosActuales: number
  ) {
    const existente = this.datosMap.get(nombreEjercicio);

    if (!existente) {
      this.datosMap.set(nombreEjercicio, {
        nombre: nombreEjercicio,
        maxPorcentaje: porcentajeObtenido,
        reintentos: reintentosActuales
      });
    } else {
      existente.reintentos = reintentosActuales;
      if (porcentajeObtenido > existente.maxPorcentaje) {
        existente.maxPorcentaje = porcentajeObtenido;
      }
      this.datosMap.set(nombreEjercicio, existente);
    }
  }
  

  /**
   * Devuelve un array con los datos de todos los ejercicios corregidos.
   */
  obtenerTodos(): DatosEjercicio[] {
    return Array.from(this.datosMap.values());
  }

  /**
   * Opción extra: para borrar datos (p. ej. al reiniciar la rutina).
   */
  limpiarDatos() {
    this.datosMap.clear();
  }

  /**
   * Devuelve los datos de un solo ejercicio por su nombre.
   */
  obtenerPorEjercicio(nombreEjercicio: string): DatosEjercicio | undefined {
    return this.datosMap.get(nombreEjercicio);
  }
}
