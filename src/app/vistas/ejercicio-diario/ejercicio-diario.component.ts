import {Component,OnInit} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { Router } from '@angular/router';
import { EjercicioDiarioDTO } from '../../core/modelos/EjercicioDiarioDTO';
import { EjercicioService } from '../../core/servicios/EjercicioServicio/ejercicio.service';

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
  
  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private sanitizer: DomSanitizer,
    private ejercicioService: EjercicioService,    
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
    this.ejercicioService.obtenerEjercicioDiario().subscribe({
      next: (response: any) => {
        if (!response || !response.objeto) {
          console.warn("No se encontró ejercicio diario para el usuario.");
          return;
        }
        
        this.ejercicioDiario = response.objeto;
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
      // Limpia espacios extra y agrega el paso
      const paso = match[1].trim();
      if (paso) {
        pasos.push(paso);
      }
    }
    
    return pasos;
  }
  

terminarEjercicioDiario() {
  if (!this.email) {
    console.warn('No se puede marcar el ejercicio como realizado: email es null');
    return;
  }
  this.usuarioService.marcarEjercicioDiarioRealizado(this.email).subscribe({
    next: (response: any) => {
      this.router.navigate(['/planes']);
    }
  });
}
}