import { Component, OnInit, Input } from '@angular/core';
import { PlanEntrenamiento } from '../../core/modelos/PlanEntrenamiento';
import { CrearPlanEntrenamientoService } from '../../core/servicios/crearPlanEntrenamientoServicio/crear-plan-entrenamiento.service';
import { Usuario } from '../../core/modelos/Usuario';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';

@Component({
  selector: 'app-planes',
  standalone: false,
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.css',
})
export class PlanesComponent {
  idUsuario: number = 1;
  planEntrenamiento?: PlanEntrenamiento;
  usuario?: Usuario;
  crearPlanEntrenamientoService: CrearPlanEntrenamientoService;
  usuarioService: UsuarioService;

  constructor(
    CrearPlanEntrenamientoService: CrearPlanEntrenamientoService,
    UsuarioService: UsuarioService
  ) {
    this.crearPlanEntrenamientoService = CrearPlanEntrenamientoService;
    this.usuarioService = UsuarioService;
  }

  ngOnInit(): void {
    this.obtenerUsuario(this.idUsuario);
    this.obtenerPlanEntrenamiento(this.idUsuario);
  }

  obtenerPlanEntrenamiento(id: number): void {
    this.crearPlanEntrenamientoService!.getPlanesDeEntrenamiento(id).subscribe({
      next: (planObtenido: PlanEntrenamiento) => {
        this.planEntrenamiento = planObtenido;
      },
      error: (err: any) => {
        console.error('Error al obtener el plan:', err);
      },
      complete: () => {
        console.log('Petición completada');
      },
    });
  }

  obtenerUsuario(id: number): void {
    this.usuarioService.obtenerUsuarioPorId(id).subscribe({
      next: (usuarioObtenido: Usuario) => {
        this.usuario = usuarioObtenido;
      },
      error: (err: any) => {
        console.error('Error al obtener el usuario:', err);
      },
      complete: () => {
        console.log('Petición completada');
      },
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

  get porcentajeProgreso(): string {
    const progreso = this.planEntrenamiento?.progresoPlan ?? 0;
    const total = this.planEntrenamiento?.totalProgresoPlan ?? 1;
    return `${(progreso / total) * 100}%`;
  }
}