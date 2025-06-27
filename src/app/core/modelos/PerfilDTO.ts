import { LogroDTO } from "./LogroDTO";

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

  constructor(id: number, nombre: string, apellido: string, email: string, peso: number, altura: number, edad: number,
    fechaCreacion: Date, fechaNacimiento: string, fotoDePerfil: string, caloriasTotales: number, entrenamientosHechos: number, tiempoTotalEntrenado: number, logros: LogroDTO[]){
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
  }
}