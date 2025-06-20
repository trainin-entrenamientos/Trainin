import { Component, OnInit } from '@angular/core';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { PlanCompleto, Rutina } from '../../core/modelos/DetallePlanDTO';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  idPlan:number=0;

  constructor(
    private planEntrenamientoService: PlanEntrenamientoService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.email = this.authService.getEmail();
    const idPlan = +this.route.snapshot.paramMap.get('PlanId')!;
    this.obtenerUsuario(idPlan);
  }

  obtenerUsuario(idPlan: number): void {
    if (!this.email) return;

    this.usuarioService.obtenerUsuarioPorId(this.email).subscribe({
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
      data.semanaRutinas.forEach((semana: any) => {
        semana.rutinas.forEach((rutina: any) => {
          rutina.estado = rutina.estadoRutina; 
        });
      });

      this.detallePlan = data;
      this.idPlan = this.detallePlan?.id ?? 0;
      this.semanas = data.semanaRutinas || [];
      this.seleccionarPrimerRutinaActiva();
      this.cargando = false;
    },
    error: (err) => {
      console.error('Error al obtener el plan:', err);
    }
  });
}

  seleccionarPrimerRutinaActiva(): void {
  for (let i = 0; i < this.semanas.length; i++) {
    const semana = this.semanas[i];
    for (let j = 0; j < semana.rutinas.length; j++) {
      const rutina = semana.rutinas[j];
      if (rutina.estado === 1) {
        this.semanaActual = i;
        this.diaActivo = j;
        return;
      }
    }
  }

  this.semanaActual = 0;
  this.diaActivo = 0;
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

get rutinaActual(): Rutina | undefined {
  return this.diasSemanaActual[this.diaActivo];
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

redirigir() {
  if (this.detallePlan) {
    this.router.navigate(['/inicio-rutina', this.detallePlan.id]);
  } else {
    console.error('detallePlan no está definido');
  }
}


}
