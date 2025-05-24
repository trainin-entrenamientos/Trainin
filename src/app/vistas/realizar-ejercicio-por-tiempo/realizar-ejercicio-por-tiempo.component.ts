import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ɵɵqueryRefresh
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RutinaService } from '../../core/servicios/rutina/rutina.service';
import { Router } from '@angular/router';
import { Ejercicio, Rutina } from '../../core/modelos/RutinaDTO';
import { Location } from '@angular/common';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';

@Component({
  selector: 'app-realizar-ejercicio-por-tiempo',
  standalone: false,
  templateUrl: './realizar-ejercicio-por-tiempo.component.html',
  styleUrl: './realizar-ejercicio-por-tiempo.component.css'
})

export class RealizarEjercicioPorTiempoComponent implements OnInit, OnDestroy {
  @ViewChild('exerciseVideo', { static: true })
  exerciseVideo!: ElementRef<HTMLIFrameElement>;

  @ViewChild('sessionCard', { static: true })
  sessionCard!: ElementRef<HTMLElement>;

  rutina: Rutina | null = null;
  ejercicioActual: Ejercicio | null = null;
  indexActual: number = 0;

  totalTime: number = 0;
  remaining: number = 0;
  isPaused: boolean = false;
  intervalId: any;

  videoUrl?: SafeResourceUrl;


  constructor(private rutinaService: RutinaService, private router: Router, private sanitizer: DomSanitizer, private temporizadorService: TemporizadorService) {}

  ngOnInit(): void {
    this.rutina = this.rutinaService.getRutina();

    if (!this.rutina) {
      this.router.navigate(['/inicio']);
      return;
    }

    this.indexActual = this.rutinaService.getIndiceActual();
    console.log("indiceActual", this.indexActual)

    if (this.indexActual >= this.rutina.ejercicios.length) {
      this.router.navigate(['/finalizacion-rutina']);
      return;
    }

    this.ejercicioActual = this.rutina.ejercicios[this.indexActual];
    this.totalTime = 15; //Por ahora aca la duracion devuelve null, asi que los ejercicios duran 30 seg
    this.remaining = this.totalTime;

    this.setVideoUrl(this.ejercicioActual.video ?? '');
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  get countdownDisplay(): string {
    return this.fmt(this.remaining);
  }

  get totalTimeDisplay(): string {
    return this.fmt(this.totalTime);
  }

  get elapsedTimeDisplay(): string {
    return this.fmt(this.totalTime - this.remaining);
  }

  get progressPercent(): number {
    return ((this.totalTime - this.remaining) / this.totalTime) * 100;
  }

  get isWarning(): boolean {
    return this.remaining <= 10;
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
        this.irAlSiguienteEjercicio();
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

  private irAlSiguienteEjercicio(): void {
    this.indexActual++;
    this.rutinaService.setIndiceActual(this.indexActual);

    if (this.indexActual >= (this.rutina?.ejercicios.length ?? 0)) {
      this.rutinaService.setIndiceActual(0)
      this.router.navigate(['/finalizacion-rutina']);
    } else {
      //window.location.reload();
      //this.router.navigate(['/realizar-ejercicio-por-tiempo']);
      this.rutinaService.setIndiceActual(this.indexActual);
      this.router.navigate(['/informacion-ejercicio']);
    }
  }

  private setVideoUrl(videoLink: string): void {
    const videoId = this.extractVideoId(videoLink);
    const startSeconds = this.extractStartTime(videoLink); // opcional, si querés parsear el &t=xxs
    const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`;

    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private extractVideoId(link: string): string{
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : '';
  }

  private extractStartTime(link: string): number {
    const match = link.match(/[?&]t=(\d+)s?/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
