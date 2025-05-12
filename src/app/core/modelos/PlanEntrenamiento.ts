export class PlanEntrenamiento {
  id: number;
  nombrePlanEntrenamiento: string;
  fueRealizado: boolean;
  progresoSemanal: number;
  progresoPlan: number;
  usuarioId: number;

  constructor(
    id: number,
    nombrePlanEntrenamiento: string,
    fueRealizado: boolean,
    progresoSemanal: number,
    progresoPlan: number,
    usuarioId: number
  ) {
    this.id = id;
    this.nombrePlanEntrenamiento = nombrePlanEntrenamiento;
    this.fueRealizado = fueRealizado;
    this.progresoSemanal = progresoSemanal;
    this.progresoPlan = progresoPlan;
    this.usuarioId = usuarioId;
  }
}
