import { Injectable } from '@angular/core';
import { DatosEjercicio } from '../../../compartido/interfaces/datos-ejercicio-correccion';

const STORAGE_KEY = 'datosCorreccionMap';

@Injectable({
  providedIn: 'root'
})
export class CorreccionDataService {

  private datosMap = new Map<string, DatosEjercicio>();

  constructor() {
    const json = sessionStorage.getItem(STORAGE_KEY);
    if (json) {
      try {
        const lista: DatosEjercicio[] = JSON.parse(json);
        lista.forEach(item => {
          this.datosMap.set(item.nombre, {
            nombre: item.nombre,
            maxPorcentaje: item.maxPorcentaje,
            reintentos: item.reintentos
          });
        });
      } catch {
        this.datosMap.clear();
      }
    }
  }

  /**
   * Registra un nuevo resultado para un ejercicio.
   * Si ya existían datos, compara el porcentaje y actualiza el máximo y los reintentos.
   * Además persiste el Map completo en sessionStorage.
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

    this.actualizarStorage();
  }

  /**
   * Devuelve un array con los datos de todos los ejercicios corregidos.
   */
  obtenerTodos(): DatosEjercicio[] {
    return Array.from(this.datosMap.values());
  }

  /**
   * Opción extra: para borrar datos (p. ej. al reiniciar la rutina).
   * Además borra la clave del sessionStorage.
   */
  limpiarDatos() {
    this.datosMap.clear();
    sessionStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Devuelve los datos de un solo ejercicio por su nombre.
   */
  obtenerPorEjercicio(nombreEjercicio: string): DatosEjercicio | undefined {
    return this.datosMap.get(nombreEjercicio);
  }


  /**
   * Toma el contenido actual del Map y lo guarda como JSON en sessionStorage
   */
  private actualizarStorage() {
    const lista: DatosEjercicio[] = Array.from(this.datosMap.values());
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  }
}
