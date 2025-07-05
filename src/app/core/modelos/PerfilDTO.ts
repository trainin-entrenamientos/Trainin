import { LogroDTO } from "./LogroDTO";
import { HistorialPlanDTO } from "./HistorialPlanDTO";

export class PerfilDTO {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  peso?: number;
  altura?: number;
  edad: number;
  fechaCreacion: Date;
  fechaNacimiento: string;
  fotoDePerfil?: string;
  caloriasTotales?: number;
  entrenamientosHechos?: number;
  tiempoTotalEntrenado?: number;
  logros?: LogroDTO[];
  planesCompletados?: HistorialPlanDTO[];
  esPremium?: boolean;
  ejerciciosDiariosCompletados?: number;

  constructor(id: number, nombre: string, apellido: string, email: string, peso: number, altura: number, edad: number,
    fechaCreacion: Date, fechaNacimiento: string, fotoDePerfil: string, caloriasTotales: number, entrenamientosHechos: number, tiempoTotalEntrenado: number, logros: LogroDTO[], esPremium?: boolean, ejerciciosDiariosCompletados?: number) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.peso = peso;
    this.altura = altura;
    this.edad = edad;
    this.fechaCreacion = fechaCreacion;
    this.fechaNacimiento = fechaNacimiento;
    this.fotoDePerfil = fotoDePerfil;
    this.caloriasTotales = caloriasTotales;
    this.entrenamientosHechos = entrenamientosHechos;
    this.tiempoTotalEntrenado = tiempoTotalEntrenado;
    this.logros=logros;
    this.esPremium = esPremium;
    this.ejerciciosDiariosCompletados = ejerciciosDiariosCompletados;
  }
}