import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RutinaService } from '../../core/servicios/rutina/rutina.service';
import { Router } from '@angular/router';
import { Ejercicio, Rutina } from '../../core/modelos/RutinaDTO';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';

@Component({
  selector: 'app-realizar-ejercicio',
  standalone: false,
  templateUrl: './realizar-ejercicio.component.html',
  styleUrl: './realizar-ejercicio.component.css',
})
export class RealizarEjercicioComponent {
  rutina: Rutina | null = null;
  ejercicioActual: Ejercicio | null = null;
  indiceActual: number = 0;
  tiempoTotal: number = 0;
  tiempoRestante: number = 0;
  estaPausado: boolean = false;
  idIntervalo: any;
  urlVideo?: SafeResourceUrl;
  esEjercicioDeTiempo: boolean = false;

  constructor(
    private rutinaService: RutinaService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private temporizadorService: TemporizadorService
  ) {}

  ngOnInit(): void {
    this.rutinaService.cargarDesdeSession();
    const datos = this.rutinaService.getDatosIniciales();
    if(!datos.rutina){
      console.error('No se encontró la rutina. Redirigiendo...');
      this.router.navigate(['/planes']);
      return
    }
    this.rutina = datos.rutina;
    this.indiceActual = datos.indiceActual;
    this.ejercicioActual = datos.ejercicio;
    if(this.ejercicioActual?.tipoEjercicio=="De tiempo") {
      this.esEjercicioDeTiempo = true;
      this.tiempoTotal = this.ejercicioActual.duracion ?? 0;
      this.tiempoRestante = this.tiempoTotal;
      this.iniciarTemporizador();
      this.temporizadorService.estaCorriendoTiempo() && this.temporizadorService.continuar();
    }
    this.setearUrlDelVideo(this.ejercicioActual?.video ?? '');   
  }

  ngOnDestroy(): void {
    clearInterval(this.idIntervalo);
  }

 botonPausa(): void {
    this.estaPausado = !this.estaPausado;
    this.temporizadorService.accionesDePausa(this.estaPausado);
  }

  private iniciarTemporizador(): void {
    this.idIntervalo = setInterval(() => {
      if (!this.estaPausado && this.tiempoRestante > 0) {
        this.tiempoRestante--;
      }

      if (this.tiempoRestante <= 0) {
        clearInterval(this.idIntervalo);
        this.rutinaService.avanzarAlSiguienteEjercicio();
        if(this.rutinaService.haySiguienteEjercicio()){
          this.router.navigate(['/informacion-ejercicio']);
        }else{
          this.router.navigate(['/finalizacion-rutina']);
        }
      }
    }, 1000);
  }

  siguienteEjercicioRutina(): void {
        this.rutinaService.avanzarAlSiguienteEjercicio();
        if(this.rutinaService.haySiguienteEjercicio()){
          this.router.navigate(['/informacion-ejercicio']);
        }else{
          this.router.navigate(['/finalizacion-rutina']);
        }
      }
      
      
  get cuentaRegresiva(): string {
      return this.temporizadorService.formatearTiempo(this.tiempoRestante);
    }

    get porcentajeDelProgreso(): number {
      return ((this.tiempoTotal - this.tiempoRestante) / this.tiempoTotal) * 100;
    }

    get esAdvertencia(): boolean {
      return this.tiempoRestante <= 10;
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