export class PerfilDTO {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  peso?: number;
  altura?: number;
  edad: number;
  fechaCreacion: Date;
  fotoDePerfil?: string;

  constructor(id: number, nombre: string, apellido: string, email: string, peso: number, altura: number, edad: number,
    fechaCreacion: Date, fotoDePerfil: string){
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.peso = peso;
    this.altura = altura;
    this.edad = edad;
    this.fechaCreacion = fechaCreacion;
    this.fotoDePerfil = fotoDePerfil;
  }
}