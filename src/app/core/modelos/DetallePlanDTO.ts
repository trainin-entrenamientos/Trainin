export interface GrupoMuscular {
  id: number;
  nombre: string;
  imagen: string | null;
}

export interface Ejercicio {
  id: number;
  nombre: string;
  repeticiones: number | null;
  series: number | null;
  duracion: number | null;
  imagen: string;
  video: string | null;
  descripcion: string | null;
  grupoMuscular: GrupoMuscular[];
}

export interface Rutina {
  id: number;
  numeroRutina: number;
  duracionEstimada: number;
  idPlan: number;
  ejercicios: Ejercicio[];
  estadoRutina: number;
}

export interface SemanaRutina {
  numeroSemana: number;
  rutinas: Rutina[];
}

export interface PlanCompleto {
  id: number;
  nombrePlan: string;
  tiempoEstimadoPlanMinutos: number;
  semanasPlan: number;
  diasPorSemanaPlan: number;
  semanaRutinas: SemanaRutina[];
  descripcionEstadoPlan:string;
}
