import { Component, OnInit, Input } from '@angular/core';
import { PlanEntrenamiento } from '../../core/modelos/PlanEntrenamiento';
import { CrearPlanEntrenamientoService } from '../../core/servicios/crearPlanEntrenamientoServicio/crear-plan-entrenamiento.service';
import { Usuario } from '../../core/modelos/Usuario';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planes',
  standalone: false,
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.css',
})
export class PlanesComponent {
  idUsuario: number = 1;
  planEntrenamiento?: any;
  usuario?: Usuario;
  crearPlanEntrenamientoService: CrearPlanEntrenamientoService;
  usuarioService: UsuarioService;
  authService: AuthService;
  router: Router;

  constructor(
    CrearPlanEntrenamientoService: CrearPlanEntrenamientoService,
    UsuarioService: UsuarioService,
    authService: AuthService,
    router: Router
  ) {
    this.crearPlanEntrenamientoService = CrearPlanEntrenamientoService;
    this.usuarioService = UsuarioService;
    this.authService = authService;
    this.router = router;
  }

  ngAfterViewInit(): void {
    this.obtenerUsuario(this.authService.getEmail());
  }

  obtenerPlanEntrenamiento(id: number): void {
    this.crearPlanEntrenamientoService!.getPlanesDeEntrenamiento(id).subscribe({
      next: (planObtenido: any) => {
        this.planEntrenamiento = planObtenido;
        console.log('Plan de entrenamiento obtenido:', planObtenido);
      },
      error: (err: any) => {
        console.error('Error al obtener el plan:', err);
      }
    });
  }

  obtenerUsuario(email: string | null): void {
    this.usuarioService.obtenerUsuarioPorId(email).subscribe({
      next: (usuarioObtenido: any) => {
        console.log('Usuario obtenido:', usuarioObtenido);
        this.usuario = usuarioObtenido;
        this.idUsuario = usuarioObtenido.id;
        this.obtenerPlanEntrenamiento(this.idUsuario);
      },
      error: (err: any) => {
        console.error('Error al obtener el usuario:', err);
      }
    });
  }

  get circulos(): boolean[] {
    const totalSemanal = this.planEntrenamiento?.totalProgresoSemanal ?? 0;
    const progresoSemanal = this.planEntrenamiento?.progresoSemanal ?? 0;
    return Array.from(
      { length: totalSemanal },
      (_, index) => index < progresoSemanal
    );
  }

 get porcentajeProgreso(): (plan: any) => string {
    return (plan: any) => {
        const progreso = plan.cantidadRutinasHechas ?? 0;
        const total = plan.cantidadRutinas ?? 1;
        return `${(progreso / total) * 100}%`;
    };
  }

  irAlDetallePlan() {
        this.router.navigate(['/detalle-plan', /*this.planEntrenamiento.id*/]);
    }
}