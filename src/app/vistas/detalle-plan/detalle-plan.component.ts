import { Component, OnInit } from '@angular/core';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { PlanCompleto, Rutina } from '../../core/modelos/DetallePlanDTO';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-plan',
  standalone: false,
  templateUrl: './detalle-plan.component.html',
  styleUrls: ['./detalle-plan.component.css']
})
export class DetallePlanComponent implements OnInit {
  semanas: any[] = [];
  semanaActual = 0;
  diaActivo = 0;
  detallePlan: PlanCompleto | undefined;
  cargando: boolean = true;
  email: string | null = null;
  idUsuario: number = 1;
  rutina: Rutina| undefined;
  

  constructor(
    private planEntrenamientoService: PlanEntrenamientoService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.email = this.authService.getEmail();
    const idPlan = +this.route.snapshot.paramMap.get('PlanId')!;
    this.obtenerUsuario(idPlan);
  }

  obtenerUsuario(idPlan: number): void {
    if (!this.email) return;

    this.usuarioService.obtenerUsuarioPorEmail(this.email).subscribe({
      next: (usuarioObtenido: any) => {
        this.idUsuario = usuarioObtenido.id;
        
        this.obtenerDetalleDelPlan(idPlan);
      },
      error: (err: any) => {
        console.error('Error al obtener el usuario:', err);
        this.cargando = false;
      }
    });
  }

  obtenerDetalleDelPlan(idPlan: number): void {
    this.planEntrenamientoService.obtenerDetallePlan(idPlan, this.idUsuario).subscribe({
      next: (data) => {
        this.detallePlan = data;
        this.semanas = data.semanaRutinas || [];
        this.semanaActual = 0;
        this.diaActivo = 0;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener el plan:', err);
      }
    });
  }

  cambiarSemana(direccion: number): void {
    const nuevoIndice = this.semanaActual + direccion;
    if (nuevoIndice >= 0 && nuevoIndice < this.semanas.length) {
      this.semanaActual = nuevoIndice;
      this.diaActivo = 0;
    }
  }

  seleccionarDia(indice: number): void {
    this.diaActivo = indice;
  }

  get semanaSeleccionada() {
    return this.semanas[this.semanaActual];
  }

  get diasSemanaActual() {
  return this.semanaSeleccionada?.rutinas ?? [];
}


  get ejerciciosDelDia() {
    return this.diasSemanaActual[this.diaActivo]?.ejercicios || [];
  }

  traducirEstadoRutina(estado: number): string {
  switch (estado) {
    case 1: return 'Activo';
    case 2: return 'Completado';
    case 3: return 'Pendiente';
    case 4: return 'Inactivo';
    default: return 'Desconocido';
  }
}

getPrimerRutinaActiva(): Rutina | null {
  for (const semana of this.semanas) {
    for (const rutina of semana.rutinas) {
      if (rutina.estado === 1) { 
        return rutina;
      }
    }
  }
  return null;
}

esPrimeraRutinaActivaActual(): boolean {
  const rutinaActual = this.diasSemanaActual?.[this.diaActivo];
  const primeraActiva = this.getPrimerRutinaActiva();
  return rutinaActual?.id === primeraActiva?.id;
}


}
