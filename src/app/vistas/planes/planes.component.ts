import { Component, OnInit, Input } from '@angular/core';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
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
  planEntrenamiento: any[] = [];
  usuario?: Usuario;
  planEntrenamientoService: PlanEntrenamientoService;
  usuarioService: UsuarioService;
  authService: AuthService;
  router: Router;
  email: string | null = null;

  constructor(
    planEntrenamientoService: PlanEntrenamientoService,
    UsuarioService: UsuarioService,
    authService: AuthService,
    router: Router
  ) {
    this.planEntrenamientoService = planEntrenamientoService;
    this.usuarioService = UsuarioService;
    this.authService = authService;
    this.router = router;
  }

  ngAfterViewInit(): void {
    this.email = this.authService.getEmail();
    this.obtenerUsuario();
  }

  obtenerPlanEntrenamiento(id: number): void {
    this.planEntrenamientoService!.getPlanesDeEntrenamiento(id).subscribe({
      next: (planObtenido: any) => {
        this.planEntrenamiento = Array.isArray(planObtenido) ? planObtenido : [];
        console.log('Planes de entrenamiento obtenidos:', this.planEntrenamiento);
      },
      error: (err: any) => {
        this.planEntrenamiento = [];
        console.error('No existen planes de entrenamiento', err);
      }
    });
  }

  obtenerUsuario(): void {
    this.usuarioService.obtenerUsuarioPorId(this.email).subscribe({
      next: (usuarioObtenido: any) => {
        this.usuario = usuarioObtenido;
        this.idUsuario = usuarioObtenido.id;
        this.obtenerPlanEntrenamiento(this.idUsuario);
      },
      error: (err: any) => {
        console.error('Error al obtener el usuario:', err);
      }
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
      this.router.navigate(['/detalle-plan'/*, idPlan*/]);
      return;
    }
    this.router.navigate(['/inicio-rutina', idPlan]);
  }

  desactivarPlan(idPlan: number): void {
    this.planEntrenamientoService.desactivarPlanPorId(idPlan, this.idUsuario).subscribe({
      next: (response) => {
        console.log('Plan desactivado:', response);
        this.obtenerPlanEntrenamiento(this.idUsuario);
      },
      error: (err) => {
        console.error('Error al desactivar el plan:', err);
      }
    });
  };
}