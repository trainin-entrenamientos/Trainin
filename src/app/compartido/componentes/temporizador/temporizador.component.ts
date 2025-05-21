import { Component, Input, OnInit } from '@angular/core';
import { TemporizadorService } from '../../../core/servicios/temporizadorServicio/temporizador.service';

@Component({
  selector: 'app-temporizador',
  templateUrl: './temporizador.component.html',
  styleUrls: ['./temporizador.component.css'],
  standalone:false
})
export class TemporizadorComponent implements OnInit {
  constructor(public temporizadorService: TemporizadorService) {}

  ngOnInit(): void {}
  // temporizador.component.ts
  @Input() isPaused: boolean = false;

  ngOnChanges(): void {
  if (this.isPaused) {
    this.temporizadorService.pause();
  } else {
    this.temporizadorService.resume();
  }
}

  get tiempoTranscurrido(): string {
    const total = this.temporizadorService.getElapsedSeconds();
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  get isRunning(): boolean {
    return this.temporizadorService.isTimerRunning();
  }
}
