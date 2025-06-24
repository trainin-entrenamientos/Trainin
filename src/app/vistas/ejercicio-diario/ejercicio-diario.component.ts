import {Component,OnInit} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


import { RetoService } from '../../core/servicios/retoServicio/reto.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { Router } from '@angular/router';
import { RetoDTO } from '../../core/modelos/RetoDTO';

@Component({
  selector: 'app-ejercicio-diario',
  templateUrl: './ejercicio-diario.component.html',
  styleUrls: ['./ejercicio-diario.component.css'],
  standalone: false
})
export class EjercicioDiarioComponent implements OnInit {
  

  
  email: string | null = null;
  reto: RetoDTO | null = null;
  idUsuario: number = 1;
  
  videoUrl!: SafeResourceUrl;
  
  nombreEjercicio = '';
  
  constructor(
    private retoService: RetoService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.reto?.video || '');

    this.email = this.authService.getEmail();
    this.obtenerUsuario();
  }


  obtenerUsuario(): void {
    if (!this.email) return;
    
    this.usuarioService.obtenerUsuarioPorEmail(this.email).subscribe({
      next: (response: any) => {
        this.idUsuario = response.objeto.id;
        this.obtenerRetoPorIdUsuario(this.idUsuario);
      },
      error: (err: any) => console.error('Error al obtener el usuario:', err)
    });
  }
  
  obtenerRetoPorIdUsuario(idUsuario: number): void {
    this.retoService.obtenerRetoPorIdUsuario(idUsuario).subscribe({
      next: (response: any) => {
        if (!response || !response.objeto) {
          console.warn("No se encontró un reto para el usuario.");
          return;
        }

        this.reto = response.objeto;
         
          if (this.reto && this.reto.video) {
            let rawVideoUrl = this.reto.video.trim();

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
      error: (err: any) => console.error('Error al obtener el reto:', err)
    });
  }

}