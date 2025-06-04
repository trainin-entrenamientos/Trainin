
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
  grupoMuscular: GrupoMuscular[];
  categoria: string;
  correccionPremium: boolean;
}

export interface Rutina {
  id: number;
  numeroRutina: number;
  duracionEstimada: number;
  nombre: string;
  ejercicios: Ejercicio[];
  rutinasRealizadas: number;
  caloriasQuemadas: number;
}
