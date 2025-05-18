
export interface GrupoMuscular {
  id: number;
  nombre: string;
}

export interface Ejercicio {
  id: number;
  nombre: string;
  repeticiones: number | null;
  duracion: number | null;
  descripcion: string;
  grupo_muscular: GrupoMuscular[];
}

export interface Rutina {
  id: number;
  numeroRutina: number;
  duracion_estimada: number;
  nombre: string;
  ejercicios: Ejercicio[];
}
