export class Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  contraseña: string;
  esPremium: boolean;
  caloriasTotales: number;
  altura: number;

  constructor(id: number, nombre: string, apellido: string, email: string, contraseña: string, esPremium: boolean, caloriasTotales: number, altura: number) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.contraseña = contraseña;
    this.esPremium = esPremium;
    this.caloriasTotales = caloriasTotales;
    this.altura = altura;
  }
}