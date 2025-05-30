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
  this.rutinaService.cargarDesdeSession();
  const datos = this.rutinaService.getDatosIniciales();

  if (!datos.rutina) {
    console.error('No se encontró la rutina. Redirigiendo...');
    this.router.navigate(['/planes']);
    return;
  }

  this.rutina = datos.rutina;
  this.ejercicio = datos.ejercicio;
  this.indiceActual = datos.indiceActual;
  this.duracionDelEjercicio = datos.duracionDelEjercicio;
  this.repeticionesDelEjercicio = datos.repeticionesDelEjercicio;
  this.tiempoRestante = this.traducirDuracionEstimada(this.rutina.duracionEstimada);
  this.iniciarCuentaRegresiva();
  this.temporizadorService.estaCorriendoTiempo() && this.temporizadorService.continuar();

}

  ngOnDestroy(): void {
    clearInterval(this.idIntervalo);
  }

  traducirDuracionEstimada(valor: number): number {
    switch (valor) {
      case 1:
        return 1; 
      case 2:
        return 30;
      default:
        return 10;
    }
  }

 botonPausar(): void {
  this.estaPausado = !this.estaPausado;
  this.temporizadorService.accionesDePausa(this.estaPausado);
}


  private iniciarCuentaRegresiva(): void {
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

  get cuentaRegresiva(): string {
    return this.temporizadorService.formatearTiempo(this.tiempoRestante);
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

    get esAdvertencia(): boolean {
    return this.tiempoRestante <= 5;
  }

  get porcentajeDelProgreso(): number {
  const tiempoTotal = this.traducirDuracionEstimada(this.rutina?.duracionEstimada ?? 1);
  return ((tiempoTotal - this.tiempoRestante) / tiempoTotal) * 100;
}
}