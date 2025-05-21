import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rutina } from '../../core/modelos/RutinaDTO';
import { RutinaService } from '../../core/servicios/rutina/rutina.service';
import { Router } from '@angular/router';
import { Ejercicio } from '../../core/modelos/RutinaDTO';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';


@Component({
  selector: 'app-informacion-ejercicio',
  standalone: false,
  templateUrl: './informacion-ejercicio.component.html',
  styleUrl: './informacion-ejercicio.component.css'
})

export class InformacionEjercicioComponent implements OnInit, OnDestroy {
  @ViewChild('exerciseVideo', { static: true }) exerciseVideo!: ElementRef<HTMLIFrameElement>;
  @ViewChild('sessionCard', { static: true }) sessionCard!: ElementRef<HTMLElement>;

  rutina: Rutina | null = null;
  ejercicios: Ejercicio[] = [];
  tiempoTotal = 0;
  remaining = 0;
  isPaused = false;
  intervalId: any;
  ejercicio: Ejercicio | null = null;
  indiceActual: number = 0;
  esPrimerEjercicio: boolean = true;
  mensaje: string = '';
  duracionDescanso = 10;
  

  constructor(private rutinaService: RutinaService, private router: Router, private temporizadorService: TemporizadorService) {}

  ngOnInit(): void {
    this.rutina = this.rutinaService.getRutina();

    if (!this.rutina) {
      console.error('No se encontró la rutina. Redirigiendo...');
      this.router.navigate(['/ruta-de-error-o-plan']);
      return;
    }
    this.indiceActual = this.rutinaService.getIndiceActual();
    console.log(this.indiceActual);
    this.ejercicios = this.conseguirEjercicios;
    this.ejercicio = this.conseguirEjercicioActual(this.indiceActual);
    /*if(this.indiceActual === 0){
      this.mensaje = '¡Comenzamos en';
      this.remaining = 5; // tiempo previo al primer ejercicio
    } else {
      this.mensaje = `Descanso. Próximo ejercicio: ${this.ejercicio?.nombre} en`;
      this.remaining = this.duracionDescanso;
    }*/

    this.tiempoTotal = this.traducirDuracionEstimada(this.rutina.duracionEstimada);
    this.remaining = this.tiempoTotal;
    
    //this.esPrimerEjercicio = this.indiceActual === 0;

    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  traducirDuracionEstimada(valor: number): number {
    switch (valor) {
      case 1: return 15 * 60;
      case 2: return 30 * 60;
      default: return 10;
    }
  }

  get tipoEjercicio(): string {
    if (!this.ejercicio) return '';
    if (this.ejercicio.duracion !== null) {
      return `${this.ejercicio.duracion} segundos`;
    }
    if (this.ejercicio.repeticiones !== null){
      return `${this.ejercicio.repeticiones} repeticiones`;
    }
    return '';
  }

  get progresoEjercicio(): string {
    const total = this.ejercicios.length;
    const actual = this.indiceActual + 1; // +1 porque arranca en 0
    return `${actual}/${total}`;
  }

  get elapsedTimeDisplay(): string {
    return this.fmt(this.tiempoTotal - this.remaining);
  }

  get totalTimeDisplay(): string {
    return this.fmt(this.tiempoTotal);
  }

  get countdownDisplay(): string {
    return this.fmt(this.remaining);
  }

  get progressPercent(): number {
    return ((this.tiempoTotal - this.remaining) / this.tiempoTotal) * 100;
  }

  get isWarning(): boolean {
    return this.remaining <= 5;
  }

  get mensajeCuentaRegresiva(): string {
  if (this.indiceActual === 0) {
    return '¡Comenzamos en';
  } else {
    const siguienteNombre = this.ejercicio?.nombre ?? 'el siguiente ejercicio';
    return `Descanso. Próximo ejercicio: ${siguienteNombre} en`;
  }

  
}


  private fmt(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  private startTimer(): void {
  this.intervalId = setInterval(() => {
    if (!this.isPaused && this.remaining > 0) {
      this.remaining--;
    }

    if (this.remaining <= 0) {
      clearInterval(this.intervalId);  
      this.router.navigate(['/realizar-ejercicio-por-tiempo']);
    
    }
  }, 1000);
}

 togglePause(): void {
  this.isPaused = !this.isPaused;

  if (this.isPaused) {
    this.temporizadorService.pause();
  } else {
    this.temporizadorService.resume();
  }
}


  closeSession(): void {
    clearInterval(this.intervalId);
    this.sessionCard.nativeElement.style.display = 'none';
  }
  get conseguirEjercicios(): Ejercicio[] {
  return this.rutina?.ejercicios || [];
  }
  conseguirEjercicioActual(i : number): Ejercicio | null {
    return this.rutina?.ejercicios[i] || null;
  }

  get tooltipTexto(): string {
  if (this.ejercicio?.tieneCorrecion) {
    return 'Este botón te permite practicar el ejercicio con la cámara y recibir correcciones.';
  } else {
    return 'Este botón te permite practicar el ejercicio con la cámara. Este ejercicio no cuenta con corrección.';
  }
}
}
