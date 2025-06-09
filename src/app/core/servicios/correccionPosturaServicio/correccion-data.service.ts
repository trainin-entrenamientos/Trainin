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

  obtenerTodos(): DatosEjercicio[] {
    return Array.from(this.datosMap.values());
  }

  limpiarDatos() {
    this.datosMap.clear();
    sessionStorage.removeItem(STORAGE_KEY);
  }

  obtenerPorEjercicio(nombreEjercicio: string): DatosEjercicio | undefined {
    return this.datosMap.get(nombreEjercicio);
  }

  private actualizarStorage() {
    const lista: DatosEjercicio[] = Array.from(this.datosMap.values());
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  }
}
