import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rutina } from '../../core/modelos/RutinaDTO';
import { RutinaService } from '../../core/servicios/rutina/rutina.service';
import { Router } from '@angular/router';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';

@Component({
  selector: 'app-inicio-rutina',
  standalone: false,
  templateUrl: './inicio-rutina.component.html',
  styleUrls: ['./inicio-rutina.component.css'],
})
export class InicioRutinaComponent {
  rutina: Rutina | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rutinaService: RutinaService,
    private temporizadorService: TemporizadorService
  ) {}

  ngOnInit(): void {
    const idPlan = +this.route.snapshot.paramMap.get('PlanId')!;
    this.obtenerRutina(idPlan);
  }

  obtenerRutina(idPlan: number) {
    this.rutinaService.getDetalleEjercicios(idPlan).subscribe(
      (rutina) => {
        this.rutina = rutina;
      },
      (error) => {
        console.error('Error al obtener la rutina:', error);
      }
    );
  }

  iniciarRutina() {
    if (this.rutina) {
      this.rutinaService.setRutina(this.rutina);
      this.temporizadorService.iniciarTiempo();
      this.rutinaService.setIndiceActual(0);
      this.router.navigate(['/informacion-ejercicio']);
    }
  }
}