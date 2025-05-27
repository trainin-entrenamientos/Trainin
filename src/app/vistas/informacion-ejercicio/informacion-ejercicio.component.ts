import { Component } from '@angular/core';
import { Rutina } from '../../core/modelos/RutinaDTO';
import { RutinaService } from '../../core/servicios/rutina/rutina.service';
import { Router } from '@angular/router';
import { Ejercicio } from '../../core/modelos/RutinaDTO';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';

@Component({
  selector: 'app-informacion-ejercicio',
  standalone: false,
  templateUrl: './informacion-ejercicio.component.html',
  styleUrl: './informacion-ejercicio.component.css',
})
export class InformacionEjercicioComponent {
  rutina: Rutina | null = null;
  ejercicios: Ejercicio[] = [];
  tiempoTotal = 0;
  tiempoRestante = 0;
  estaPausado = false;
  idIntervalo: any;
  ejercicio: Ejercicio | null = null;
  indiceActual: number = 0;
  esPrimerEjercicio: boolean = true;
  mensaje: string = '';
  duracionDescanso = 10;
  duracionDelEjercicio: string = '';
  repeticionesDelEjercicio: string = '';

  constructor(
    private rutinaService: RutinaService,
    private router: Router,
    private temporizadorService: TemporizadorService
  ) {}

  ngOnInit(): void {
    this.rutina = this.rutinaService.getRutina();

    if (!this.rutina) {
      console.error('No se encontró la rutina. Redirigiendo...');
      this.router.navigate(['/ruta-de-error-o-plan']);
      return;
    }

    this.indiceActual = this.rutinaService.getIndiceActual();
    this.ejercicios = this.rutina.ejercicios || [];
    this.ejercicio = this.obtenerInformacionDelEjercicioActual(
      this.indiceActual
    );
    this.tiempoTotal = this.traducirDuracionEstimada(
      this.rutina.duracionEstimada
    );
    this.tiempoRestante = this.tiempoTotal;
    this.iniciarTemporizador();
  }

  ngOnDestroy(): void {
    clearInterval(this.idIntervalo);
  }

  traducirDuracionEstimada(valor: number): number {
    switch (valor) {
      case 1:
        return 15;
      case 2:
        return 30;
      default:
        return 10;
    }
  }

  get cuentaRegresiva(): string {
    return this.formatearTiempo(this.tiempoRestante);
  }

  get porcentajeDelProgreso(): number {
    return ((this.tiempoTotal - this.tiempoRestante) / this.tiempoTotal) * 100;
  }

  get esAdvertencia(): boolean {
    return this.tiempoRestante <= 5;
  }

  get mensajeCuentaRegresiva(): string {
    if (this.indiceActual === 0) {
      return '¡Comenzamos en ';
    } else {
      return `Descanso. Continuá con el ejercicio ${
        this.ejercicio?.nombre ?? ''
      } en:`;
    }
  }

  private formatearTiempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60)
      .toString()
      .padStart(2, '0');
    const segundosRestantes = (segundos % 60).toString().padStart(2, '0');
    return `${minutos}:${segundosRestantes}`;
  }

  private iniciarTemporizador(): void {
    this.idIntervalo = setInterval(() => {
      if (!this.estaPausado && this.tiempoRestante > 0) {
        this.tiempoRestante--;
      }

      if (this.tiempoRestante <= 0) {
        clearInterval(this.idIntervalo);
        this.router.navigate(['/realizar-ejercicio-por-tiempo']);
      }
    }, 1000);
  }

  botonPausar(): void {
    this.estaPausado = !this.estaPausado;

    if (this.estaPausado) {
      this.temporizadorService.pausar();
    } else {
      this.temporizadorService.continuar();
    }
  }

  obtenerInformacionDelEjercicioActual(i: number): Ejercicio | null {
    let ejercicioActual = this.rutina?.ejercicios[i] ?? null;
    this.duracionDelEjercicio = this.ejercicio?.duracion
      ? `${this.ejercicio.duracion} segundos`
      : '';
    this.repeticionesDelEjercicio = this.ejercicio?.repeticiones
      ? `${this.ejercicio.repeticiones} repeticiones`
      : '';
    return ejercicioActual;
  }
}