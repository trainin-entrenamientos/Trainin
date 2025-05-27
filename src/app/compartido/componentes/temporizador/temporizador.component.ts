import { Component, Input } from '@angular/core';
import { TemporizadorService } from '../../../core/servicios/temporizadorServicio/temporizador.service';

@Component({
  selector: 'app-temporizador',
  templateUrl: './temporizador.component.html',
  styleUrls: ['./temporizador.component.css'],
  standalone: false,
})
export class TemporizadorComponent {
  @Input() estaPausado: boolean = false;

  constructor(private temporizadorService: TemporizadorService) {}

  ngOnChanges(): void {
    if (this.estaPausado) {
      this.temporizadorService.pausar();
    } else {
      this.temporizadorService.continuar();
    }
  }

  get tiempoTranscurrido(): string {
    const total = this.temporizadorService.obtenerSegundosTranscurridos();
    const m = Math.floor(total / 60)
      .toString()
      .padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  get isRunning(): boolean {
    return this.temporizadorService.estaCorriendoTiempo();
  }
}