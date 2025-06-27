import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rutina } from '../../core/modelos/RutinaDTO';
import { Ejercicio } from '../../core/modelos/RutinaDTO';
import { RutinaService } from '../../core/servicios/rutinaServicio/rutina.service';
import { Router } from '@angular/router';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';
import { ToastrService } from 'ngx-toastr';
import { manejarErrorYRedirigir } from '../../compartido/utilidades/errores-toastr';

@Component({
  selector: 'app-inicio-rutina',
  standalone: false,
  templateUrl: './inicio-rutina.component.html',
  styleUrls: ['./inicio-rutina.component.css'],
})
export class InicioRutinaComponent {
  rutina: Rutina | null = null;
  selectedEjercicioIndex: number = 0;
  ejercicios: Ejercicio[] = [];
  cargando: boolean = true;
  minutosTraducidos: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rutinaService: RutinaService,
    private temporizadorService: TemporizadorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.rutinaService.cargarDesdeSession();
    const idPlan = +this.route.snapshot.paramMap.get('PlanId')!;
    this.cargarRutina(idPlan);
  }

  iniciarRutina(): void {
    if (!this.rutina) return;

    this.rutinaService.setIndiceActual(0);
    this.temporizadorService.reiniciarTiempo();
    this.temporizadorService.iniciarTiempo();
    this.router.navigate(['/informacion-ejercicio']);
  }

  private cargarRutina(idPlan: number): void {
    this.rutinaService.getDetalleEjercicios(idPlan).subscribe({
      next: (rutina) => {
        if (rutina.objeto == null) {
          this.cargando = false;
        }
        this.rutina = rutina.objeto;
        this.rutinaService.setRutina(rutina.objeto);
        this.ejercicios = rutina.objeto.ejercicios;
        this.minutosTraducidos = this.traducirMinutos(
        this.rutina.duracionEstimada
        );
        this.cargando = false;
      },
      error: (err) => {
        manejarErrorYRedirigir(this.toastr, this.router, `No se pudo obtener la rutina`, '/planes');
      },
    });
  }

  public traducirMinutos(valor: number): string {
    const mapa: Record<string, string> = {
      1: '≈15 min.',
      2: '≈30 min.',
      3: '≈45 min.',
    };
    return mapa[valor] || 'No especificado';
  }

  selectEjercicio(index: number) {
    this.selectedEjercicioIndex = index;
  }

  anteriorEjercicio() {
    this.selectedEjercicioIndex =
      (this.selectedEjercicioIndex - 1 + this.ejercicios.length) %
      this.ejercicios.length;
  }

  siguienteEjercicio() {
    this.selectedEjercicioIndex =
      (this.selectedEjercicioIndex + 1) % this.ejercicios.length;
  }
}
