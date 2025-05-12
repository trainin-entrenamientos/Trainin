export class PlanEntrenamiento {
  id: number;
  nombrePlanEntrenamiento: string;
  fueRealizado: boolean;
  progresoSemanal: number;
  totalProgresoSemanal: number;
  progresoPlan: number;
  totalProgresoPlan: number;
  usuarioId: number;
  totalPlanes: number;

  constructor(
    id: number,
    nombrePlanEntrenamiento: string,
    fueRealizado: boolean,
    progresoSemanal: number,
    progresoPlan: number,
    usuarioId: number,
    totalPlanes: number,
    totalProgresoSemanal: number,
    totalProgresoPlan: number
  ) {
    this.id = id;
    this.nombrePlanEntrenamiento = nombrePlanEntrenamiento;
    this.fueRealizado = fueRealizado;
    this.progresoSemanal = progresoSemanal;
    this.progresoPlan = progresoPlan;
    this.usuarioId = usuarioId;
    this.totalPlanes = totalPlanes;
    this.totalProgresoSemanal = totalProgresoSemanal;
    this.totalProgresoPlan = totalProgresoPlan;
  }
}