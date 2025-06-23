export interface Ejercicio {
  id: number;
  nombre: string;
  descripcion: string;
  video: string;
  valorMet: number;
  landmark: string;
  tieneCorreccion: boolean;
  imagen: string;
  correccionPremium: boolean;
  idTipoEjercicio: number;
  idsGrupoMuscular: number[];
  idsCategorias: number[];
}

export type EjercicioIncorporadoDTO = Ejercicio;