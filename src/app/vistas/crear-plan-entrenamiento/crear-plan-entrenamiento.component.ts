import { Component, OnInit } from '@angular/core';
import { PlanEntrenamiento } from '../../core/modelos/PlanEntrenamiento';
import { CrearPlanEntrenamientoService } from '../../core/servicios/crearPlanEntrenamientoServicio/crear-plan-entrenamiento.service';
import { Usuario } from '../../core/modelos/Usuario';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';

@Component({
  selector: 'app-crear-plan-entrenamiento',
  standalone: false,
  templateUrl: './crear-plan-entrenamiento.component.html',
  styleUrl: './crear-plan-entrenamiento.component.css',
})
export class CrearPlanEntrenamientoComponent implements OnInit {
  idUsuario: number = 1;
  planEntrenamiento?: PlanEntrenamiento;
  usuario?: Usuario;
  crearPlanEntrenamientoService: CrearPlanEntrenamientoService;
  usuarioService: UsuarioService;

  constructor(CrearPlanEntrenamientoService: CrearPlanEntrenamientoService, UsuarioService: UsuarioService) {
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
}