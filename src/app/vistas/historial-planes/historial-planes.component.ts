import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HistorialPlanDTO } from '../../core/modelos/HistorialPlanDTO';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { manejarErrorYRedirigir } from '../../compartido/utilidades/errores-toastr';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-historial-planes',
  standalone: false,
  templateUrl: './historial-planes.component.html',
  styleUrl: './historial-planes.component.css',
})
export class HistorialPlanesComponent {
  cargando: boolean = true;
  email: string | null = null;

  planesHistorial: HistorialPlanDTO[] = [];
  tienePlanes: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private planService: PlanEntrenamientoService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.email = this.authService.getEmail();
    this.obtenerHistorialPlanes();
  }

  obtenerHistorialPlanes() {
    if (!this.email) {
      manejarErrorYRedirigir(this.toastr, this.router, `No se pudo obtener el email del usuario`, '/planes');
      return;
    }
    this.planService.obtenerHistorialPlanes(this.email).subscribe({
      next: (data) => {
        this.planesHistorial = data.objeto;
        this.cargando = false;
        if(this.planesHistorial.length === 0) {
          this.tienePlanes= false;
        }
      },
      error: (err) => {
        manejarErrorYRedirigir(this.toastr, this.router, "No se obtuvo el historial de planes", '/planes');
      },
    });
  }

  irAlDetalle(idPlan: number) {
    this.router.navigate(['/detalle-plan', idPlan]);
  }

  formatearTiempo(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    return horas > 0
      ? `${pad(horas)}:${pad(minutos)}:${pad(segundosRestantes)}`
      : `${pad(minutos)}:${pad(segundosRestantes)}`;
  }
}
