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
    this.rutinaService.limpiarRutina();
    const idPlan = +this.route.snapshot.paramMap.get('PlanId')!;
    this.cargarRutina(idPlan);
  }
    
    iniciarRutina(): void {
    if (!this.rutina) return;
    
    this.rutinaService.setIndiceActual(0);
    this.temporizadorService.iniciarTiempo();
    this.router.navigate(['/informacion-ejercicio']);
  }
   
 private cargarRutina(idPlan: number): void {
    this.rutinaService.getDetalleEjercicios(idPlan).subscribe({
      next: rutina => {
        this.rutina = rutina;                        
        this.rutinaService.setRutina(rutina);        
      },
      error: err => console.error('Error al obtener la rutina:', err)
    });
  }
}