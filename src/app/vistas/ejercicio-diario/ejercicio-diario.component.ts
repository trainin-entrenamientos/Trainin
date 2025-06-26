import {Component,OnInit} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { Router } from '@angular/router';
import { EjercicioDiarioDTO } from '../../core/modelos/EjercicioDiarioDTO';
import { EjercicioService } from '../../core/servicios/EjercicioServicio/ejercicio.service';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';

@Component({
  selector: 'app-ejercicio-diario',
  templateUrl: './ejercicio-diario.component.html',
  styleUrls: ['./ejercicio-diario.component.css'],
  standalone: false
})
export class EjercicioDiarioComponent implements OnInit {
  
  email: string | null = null;
  ejercicioDiario: EjercicioDiarioDTO | null = null;
  idUsuario: number = 1;
  
  videoUrl!: SafeResourceUrl;
  descripcionLista: string[] = [];
  nombreEjercicio = '';

  estaIniciado: boolean = false;
  mostrarCuentaAtras: boolean = false;
  cuentaRegresiva: string = '';
  tiempoRestante: number = 0;
  porcentajeDelProgreso: number = 0;
  intervaloCuentaAtras: any;
  intervaloTemporizador: any;
  tiempoFinalizado: boolean = false;
  
  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private sanitizer: DomSanitizer,
    private ejercicioService: EjercicioService,
    private temporizadorService: TemporizadorService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.ejercicioDiario?.video || '');

    this.email = this.authService.getEmail();
    this.obtenerUsuario();
  }


  obtenerUsuario(): void {
    if (!this.email) return;
    
    this.usuarioService.obtenerUsuarioPorEmail(this.email).subscribe({
      next: (response: any) => {
        this.idUsuario = response.objeto.id;
        this.obtenerEjercicioDiario();
      },
      error: (err: any) => console.error('Error al obtener el usuario:', err)
    });
  }
  
  obtenerEjercicioDiario(): void {
    if (!this.email) {
      console.warn('No se puede obtener el ejercicio diario: email es null');
      return;
    }

    this.ejercicioService.obtenerEjercicioDiario(this.email).subscribe({
      next: (response: any) => {
        if (!response) {
          console.warn("No se encontró ejercicio diario para el usuario.");
          return;
        }
        
        this.ejercicioDiario = response;
        this.descripcionLista = this.separarPasos(this.ejercicioDiario?.descripcion || '');

        if (this.ejercicioDiario && this.ejercicioDiario.video) {
          let rawVideoUrl = this.ejercicioDiario.video.trim();
          
          if (rawVideoUrl.includes('watch?v=')) {
            const videoId = rawVideoUrl.split('watch?v=')[1].split('&')[0];
            rawVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
          }else if (rawVideoUrl.includes('youtu.be/')) {
            const videoId = rawVideoUrl.split('youtu.be/')[1].split('?')[0];
            rawVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
          }
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawVideoUrl);
        } 
      },
      error: (err: any) => console.error('Error al obtener el ejercicio:', err)
    });
  }
  separarPasos(texto: string): string[] {
    const regex = /\d+\)\s*([^0-9]*?)(?=\s*\d+\)|$)/g;
    const pasos: string[] = [];
    let match;
    
    while ((match = regex.exec(texto)) !== null) {
      const paso = match[1].trim();
      if (paso) {
        pasos.push(paso);
      }
    }
    
    return pasos;
  }

  iniciarEjercicioTemporizado(): void {
    this.mostrarCuentaAtras = true;
    let segundos = 3;
    this.cuentaRegresiva = segundos.toString();

    this.intervaloCuentaAtras = setInterval(() => {
      segundos--;
      this.cuentaRegresiva = segundos > 0 ? segundos.toString() : '¡Vamos!';
      if (segundos < 0) {
        clearInterval(this.intervaloCuentaAtras);
        this.mostrarCuentaAtras = false;
        this.comenzarTemporizador();
      }
    }, 1000);
  }

  comenzarTemporizador(): void {
    if (!this.ejercicioDiario?.tiempo) return;

    this.estaIniciado = true;
    this.tiempoRestante = this.ejercicioDiario.tiempo;
    const tiempoTotal = this.tiempoRestante;

    this.intervaloTemporizador = setInterval(() => {
      this.tiempoRestante--;
      this.porcentajeDelProgreso = ((tiempoTotal - this.tiempoRestante) / tiempoTotal) * 100;
      this.cuentaRegresiva = this.temporizadorService.formatearTiempo(this.tiempoRestante);

      if (this.tiempoRestante <= 0) {
        clearInterval(this.intervaloTemporizador);
        this.porcentajeDelProgreso = 100;
        this.tiempoFinalizado = true;
      }
    }, 1000);
  }
  

terminarEjercicioDiario() {
  if (!this.email) {
    console.warn('No se puede marcar el ejercicio como realizado: email es null');
    return;
  }
  this.ejercicioService.marcarEjercicioDiarioRealizado(this.email).subscribe({
    next: (response: any) => {
      this.router.navigate(['/planes']);
    }
  });
}
}