
export interface GrupoMuscular {
  id: number;
  nombre: string;
  imagen: string;
}

export interface Ejercicio {
  id: number;
  nombre: string;
  repeticiones: number | null;
  series: number | null;
  duracion: number | null;
  imagen: string;
  video: string;
  descripcion: string;
  tieneCorrecion: boolean;
  categoria:Categoria[];
  grupoMuscular: GrupoMuscular[];
  correccionPremium: boolean;
  tipoEjercicio: string;
}

export interface Rutina {
  id: number;
  numeroRutina: number;
  duracionEstimada: number;
  nombre: string;
  ejercicios: Ejercicio[];
  categoriaEjercicio: string;
  rutinasRealizadas: number;
  caloriasQuemadas: number;
  numeroDeRutinaSemanal: number;
  cantidadDeRutinasTotales: number;
  cantidadDeRutinasPorSemana: number;
}

export interface Categoria{
  nombre:string;
}
