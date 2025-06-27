import { Component, HostListener } from '@angular/core';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { Usuario } from '../../core/modelos/Usuario';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { Router } from '@angular/router';
import { PlanCompleto } from '../../core/modelos/DetallePlanDTO';
import { ToastrService } from 'ngx-toastr';
import { manejarErrorSimple, manejarErrorYRedirigir } from '../../compartido/utilidades/errores-toastr';
import { EjercicioService } from '../../core/servicios/EjercicioServicio/ejercicio.service';


@Component({
  selector: 'app-planes',
  standalone: false,
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.css',
})
export class PlanesComponent {
    eliminar(arg0: number) {
        throw new Error('Method not implemented.');
    }
  idUsuario: number = 1;
  planEntrenamiento: any[] = [];
  usuario?: Usuario;
  planEntrenamientoService: PlanEntrenamientoService;
  usuarioService: UsuarioService;
  authService: AuthService;
  router: Router;
  email: string | null = null;
  cargando: boolean = true;
  planAEliminarId: number | null = null;
  mostrarModal: boolean = false;
  detallePlan: PlanCompleto | undefined;
  pantallaChica: boolean = window.innerWidth <= 1080;
  imagenPlan: string = '';

  EjercicioDiarioDisponible: boolean = false;
  nombreEjercicioDiario: string = '';
  ejercicioService: EjercicioService;


  constructor(
    planEntrenamientoService: PlanEntrenamientoService,
    UsuarioService: UsuarioService,
    authService: AuthService,
    router: Router,
    private toastr: ToastrService,
    ejercicioService: EjercicioService
  ) {
    this.planEntrenamientoService = planEntrenamientoService;
    this.usuarioService = UsuarioService;
    this.authService = authService;
    this.router = router;
    this.ejercicioService = ejercicioService;
  }

  ngOnInit(): void {
    this.email = this.authService.getEmail();
    this.obtenerUsuario();
    this.verificarDisponibilidadDeEjercicioDiario();
  }

  obtenerPlanEntrenamiento(id: number): void {
    this.planEntrenamientoService!.getPlanesDeEntrenamiento(id).subscribe({
      next: (planObtenido) => {
        this.planEntrenamiento = planObtenido.objeto;
        setTimeout(() => {
          this.cargando = false;
        }, 500);
        if(this.planEntrenamiento.length === 0) {
           this.planEntrenamiento = [];
           this.cargando = false;
        }
      },
      error: (err: any) => {
        manejarErrorYRedirigir(this.toastr, this.router, "Error al obtener los planes de entrenamiento", '/inicio');
      },
    });
  }

  tipoPlanAImagen: { [key: string]: string } = {
    'Cuerpo completo': '/imagenes/cuerpo-completo.png',
    'Cardio': '/imagenes/cardio.png',
    'Tren superior': '/imagenes/tren-superior.png',
    'Tren inferior': '/imagenes/tren-inferior.png',
  };

  obtenerUsuario(): void {
    this.usuarioService.obtenerUsuarioPorEmail(this.email).subscribe({
      next: (response: any) => {
        this.usuario = response.objeto;
        this.idUsuario = response.objeto.id;
        this.obtenerPlanEntrenamiento(this.idUsuario);
      },
      error: (err: any) => {
        manejarErrorYRedirigir(this.toastr, this.router, `No se pudo obtener al usuario`, '/inicio');
      },
    });
  }

  calcularPorcentajeProgreso(plan: any): string {
    if (!plan) return '0%';
    const progreso = plan.cantidadRutinasHechas ?? 0;
    const total = plan.cantidadRutinas ?? 1;
    return `${((progreso / total) * 100).toFixed(2)}%`;
  }

  irAlPlan(idPlan: number, estado: string): void {
    if (estado === 'Realizada hoy') {
      this.router.navigate(['/detalle-plan', idPlan]);
      return;
    }
    this.router.navigate(['/inicio-rutina', idPlan]);
  }

  confirmarEliminacion(id: number): void {
    this.planAEliminarId = id;
    this.mostrarModal = true;
  }

  cancelarEliminacion(): void {
    this.planAEliminarId = null;
    this.mostrarModal = false;
  }

  eliminarPlanConfirmado(): void {
    if (this.planAEliminarId !== null) {
      this.desactivarPlan(this.planAEliminarId);
      this.planAEliminarId = null;
    }
    this.mostrarModal = false;
  }

  verificarDisponibilidadDeEjercicioDiario(): void {

    if (!this.email) {
      this.EjercicioDiarioDisponible = false;
      this.nombreEjercicioDiario = '';
      return;
    }

    this.ejercicioService.obtenerEjercicioDiario(this.email).subscribe({
      next: (response) => {
        if (response.objeto) {
          this.EjercicioDiarioDisponible = true;
          this.nombreEjercicioDiario = response.objeto?.nombre;
        } else {
          this.EjercicioDiarioDisponible = false;
          this.nombreEjercicioDiario = '';
        }
      },
      error: (err: any) => {
        console.warn('Error al verificar el ejercicio diario:', err);
        this.EjercicioDiarioDisponible = false;
      }
    });
  }


  desactivarPlan(idPlan: number): void {
    this.planEntrenamientoService
      .desactivarPlanPorId(idPlan, this.idUsuario)
      .subscribe({
        next: (response) => {
          this.obtenerPlanEntrenamiento(this.idUsuario);
        },
        error: (err) => {
          manejarErrorSimple(this.toastr, `Error al desactivar el plan`);
        },
      });
  }

  irAlDetalleDelPlan(idPlan: number): void {
    this.router.navigate(['/detalle-plan', idPlan]);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.pantallaChica = event.target.innerWidth <= 1080;
  }
}
