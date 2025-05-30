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
  indiceActual: number = 0;
  ejercicio: Ejercicio | null = null;
  duracionDelEjercicio: string = '';
  repeticionesDelEjercicio: string = '';
  duracionDescanso = 10;
  
  tiempoTotal = 0;
  tiempoRestante = 0;
  estaPausado = false;
  idIntervalo: any;
  esPrimerEjercicio: boolean = true;

  constructor(
    private rutinaService: RutinaService,
    private router: Router,
    private temporizadorService: TemporizadorService
  ) {}

  ngOnInit(): void {
  const datos = this.rutinaService.getDatosIniciales();

  if (!datos.rutina) {
    console.error('No se encontró la rutina. Redirigiendo...');
    this.router.navigate(['/ruta-de-error-o-plan']);
    return;
  }

  this.rutina = datos.rutina;
  this.indiceActual = datos.indiceActual;
  this.ejercicio = datos.ejercicio;
  this.duracionDelEjercicio = datos.duracionDelEjercicio;
  this.repeticionesDelEjercicio = datos.repeticionesDelEjercicio;

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
        return 1; //ACÁ MODIFIQUE PARA CODEAR EASLY
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
    if (this.rutinaService.getIndiceActual() === 0) {
      return '¡Comenzamos en ';
    } else {
      return `Descanso. Continuá con el ejercicio ${
        this.ejercicio?.nombre ?? ''
      } en:`;
    }
  }

  botonPausar(): void {
    this.estaPausado = !this.estaPausado;
    
    if (this.estaPausado) {
      this.temporizadorService.pausar();
    } else {
      this.temporizadorService.continuar();
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
}