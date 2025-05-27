import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RutinaService } from '../../core/servicios/rutina/rutina.service';
import { Router } from '@angular/router';
import { Ejercicio, Rutina } from '../../core/modelos/RutinaDTO';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';

@Component({
  selector: 'app-realizar-ejercicio-por-tiempo',
  standalone: false,
  templateUrl: './realizar-ejercicio-por-tiempo.component.html',
  styleUrl: './realizar-ejercicio-por-tiempo.component.css',
})
export class RealizarEjercicioPorTiempoComponent {
  rutina: Rutina | null = null;
  ejercicioActual: Ejercicio | null = null;
  indiceActual: number = 0;
  tiempoTotal: number = 0;
  tiempoRestante: number = 0;
  estaPausado: boolean = false;
  idIntervalo: any;
  urlVideo?: SafeResourceUrl;

  constructor(
    private rutinaService: RutinaService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private temporizadorService: TemporizadorService
  ) {}

  ngOnInit(): void {
    this.rutina = this.rutinaService.getRutina();

    if (!this.rutina) {
      this.router.navigate(['/inicio']);
      return;
    }

    this.indiceActual = this.rutinaService.getIndiceActual();

    if (this.indiceActual >= this.rutina.ejercicios.length) {
      this.router.navigate(['/finalizacion-rutina']);
      return;
    }

    this.ejercicioActual = this.rutina.ejercicios[this.indiceActual];
    this.tiempoTotal = this.ejercicioActual.duracion ?? 30;
    this.tiempoRestante = this.tiempoTotal;

    this.setearUrlDelVideo(this.ejercicioActual.video ?? '');
    this.iniciarTemporizador();
  }

  ngOnDestroy(): void {
    clearInterval(this.idIntervalo);
  }

  get cuentaRegresiva(): string {
    return this.formatearTiempo(this.tiempoRestante);
  }

  get porcentajeDelProgreso(): number {
    return ((this.tiempoTotal - this.tiempoRestante) / this.tiempoTotal) * 100;
  }

  get esAdvertencia(): boolean {
    return this.tiempoRestante <= 10;
  }

  private formatearTiempo(segundosTotales: number): string {
    const minutos = Math.floor(segundosTotales / 60)
      .toString()
      .padStart(2, '0');
    const segundos = (segundosTotales % 60).toString().padStart(2, '0');
    return `${minutos}:${segundos}`;
  }

  private iniciarTemporizador(): void {
    this.idIntervalo = setInterval(() => {
      if (!this.estaPausado && this.tiempoRestante > 0) {
        this.tiempoRestante--;
      }

      if (this.tiempoRestante <= 0) {
        clearInterval(this.idIntervalo);
        this.irAlSiguienteEjercicio();
      }
    }, 1000);
  }

  private irAlSiguienteEjercicio(): void {
    this.indiceActual++;
    this.rutinaService.setIndiceActual(this.indiceActual);

    if (this.indiceActual >= (this.rutina?.ejercicios.length ?? 0)) {
      this.rutinaService.setIndiceActual(0);
      this.router.navigate(['/finalizacion-rutina']);
    } else {
      this.rutinaService.setIndiceActual(this.indiceActual);
      this.router.navigate(['/informacion-ejercicio']);
    }
  }

  botonPausa(): void {
    this.estaPausado = !this.estaPausado;

    if (this.estaPausado) {
      this.temporizadorService.pausar();
    } else {
      this.temporizadorService.continuar();
    }
  }

  private setearUrlDelVideo(linkDelVideo: string): void {
    const videoId = this.extraerIdDelVideo(linkDelVideo);
    const tiempoDeInicio = this.extraerTiempoDeInicio(linkDelVideo);
    const url = `https://www.youtube.com/embed/${videoId}?start=${tiempoDeInicio}&autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`;
    this.urlVideo = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private extraerIdDelVideo(link: string): string {
    const expresionRegular =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const coincidencia = link.match(expresionRegular);
    return coincidencia ? coincidencia[1] : '';
  }

  private extraerTiempoDeInicio(link: string): number {
    const coincidencia = link.match(/[?&]t=(\d+)s?/);
    return coincidencia ? parseInt(coincidencia[1], 10) : 0;
  }
}