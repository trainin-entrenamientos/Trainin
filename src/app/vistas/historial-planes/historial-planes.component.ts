import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HistorialPlanDTO } from '../../core/modelos/HistorialPlanDTO';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private planService: PlanEntrenamientoService
  ) {}

  ngOnInit() {
    this.email = this.authService.getEmail();
    this.obtenerHistorialPlanes();
  }

  obtenerHistorialPlanes() {
    if (!this.email) {
      return;
    }
    this.planService.obtenerHistorialPlanes(this.email).subscribe({
      next: (data) => {
        this.planesHistorial = data.objeto;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando historial', err);
      },
    });
  }

  irAlDetalle(idPlan: number) {
    this.router.navigate(['/detalle-plan', idPlan]);
  }
}
