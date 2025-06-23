import {Component,ElementRef,ViewChild,OnInit,OnDestroy, AfterViewInit} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

import { NombreEjercicio } from '../../compartido/enums/nombre-ejercicio.enum';
import { FabricaManejadoresService } from '../../core/servicios/correccionPosturaServicio/fabrica-manejadores.service';
import { ManejadorCorreccion } from '../../compartido/interfaces/manejador-correccion.interface';
import { ResultadoCorreccion } from '../../compartido/interfaces/resultado-correccion.interface';
import { formatearNombreEjercicio, stripHtml } from '../../compartido/utilidades/correccion-postura.utils';

import { RetoService } from '../../core/servicios/retoServicio/reto.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { Router } from '@angular/router';
import { RetoDTO } from '../../core/modelos/RetoDTO';

@Component({
  selector: 'app-retos',
  templateUrl: './retos.component.html',
  styleUrls: ['./retos.component.css'],
  standalone: false
})
export class RetosComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('webcam', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('outputCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private detector: poseDetection.PoseDetector | null = null;
  private idFrameAnimacion: number | null = null;
  
  email: string | null = null;
  reto: RetoDTO | null = null;
  idUsuario: number = 1;
  
  camaraActiva = false;
  cargandoCamara = true;
  manejador!: ManejadorCorreccion;
  ejercicio!: NombreEjercicio;
  videoUrl!: SafeResourceUrl;
  
  nombreEjercicio = '';
  corrigiendo = false;
  mostrarBotonIniciar = true;
  mostrarBotonReintentar = false;
  repeticionesActuales = 0;
  retroalimentacion = '';
  colorRetroalimentacion = '';
  resumenHtml = '';
  ultimoPorcentaje = 0;
  reintentos = 0;
  maxReintentos = 2;
  resultados: boolean[] = [];
  retoCompletado = false;

  contador = 0;

  readonly repeticionesEvaluacion = 10;
  circulos = Array(this.repeticionesEvaluacion);
  
  constructor(
    private retoService: RetoService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private fabrica: FabricaManejadoresService
  ) {}

  ngOnInit(): void {
    // Se carga un video por defecto para evitar errores si no se carga el video del reto
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0'
    );
    
    this.email = this.authService.getEmail();
    this.obtenerUsuario();
    this.nombreEjercicio = formatearNombreEjercicio(this.reto?.nombre || '');

    if(this.reto?.video && this.reto ){
      let rawVideoUrl = this.reto.video.trim();
      if (rawVideoUrl.includes('watch?v=')) {
            const videoId = rawVideoUrl.split('watch?v=')[1].split('&')[0];
            rawVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
          }
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawVideoUrl);
    }else {
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.manejador.videoUrl);
    }
    
  }

  async ngAfterViewInit() {
    await this.crearDetector();
    await this.iniciarCamara();
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    this.detenerCamara();
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => {
    if (this.videoRef && this.canvasRef) {
      const v = this.videoRef.nativeElement;
      const c = this.canvasRef.nativeElement;
      c.width = v.clientWidth;
      c.height = v.clientHeight;
    }
  }

  private async crearDetector() {
    try {
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        { runtime: 'mediapipe', solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose' }
      );
    } catch {
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        { runtime: 'tfjs', modelType: 'full' }
      );
    }
  }

  private async iniciarCamara(intento = 0): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Tu navegador no soporta cámara.');
      return;
    }
    
    if (!this.videoRef) {
      console.warn('VideoRef no está disponible aún');
      return;
    }

    const video = this.videoRef.nativeElement;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        this.onResize();
        this.cargandoCamara = false;
      }
      await video.play();
      this.onResize();
      this.camaraActiva = true;
      this.bucleDeteccion();
    } catch (err: any) {
      if (err.name === 'AbortError' && intento < 5) {
        console.warn(`Timeout cámara (int ${intento + 1}/5), reintentando…`);
        setTimeout(() => this.iniciarCamara(intento + 1), 1000);
      } else {
        alert('No se pudo acceder a la cámara. Revisa permisos.');
        console.error('Error cámara:', err);
      }
    }
  }

  private detenerCamara() {
    if (this.idFrameAnimacion) cancelAnimationFrame(this.idFrameAnimacion);
    
    if (this.videoRef && this.videoRef.nativeElement) {
      const video = this.videoRef.nativeElement;
      if (video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        video.srcObject = null;
      }
    }
    this.camaraActiva = false;
  }

  iniciar() {
    if (!this.manejador) {
      alert('No se ha cargado el ejercicio correctamente');
      return;
    }

    this.contador = 5;
    this.mostrarBotonIniciar = true;
    const iv = setInterval(() => {
      this.contador--;
      if (this.contador <= 0) {
        clearInterval(iv);
        this.mostrarBotonIniciar = false;
        this.comenzarCorreccion();
      }
    }, 1000);
  }

  comenzarCorreccion() {
    if (!this.manejador) return;
    
    this.manejador.reset();
    this.corrigiendo = true;
    this.mostrarBotonReintentar = false;
    this.retroalimentacion = '';
    this.colorRetroalimentacion = '';
    this.repeticionesActuales = 0;
    this.resumenHtml = '';
    this.resultados = [];
    this.updateCirculos();
  }

  private async bucleDeteccion() {
    if (!this.camaraActiva || !this.detector || !this.videoRef) return;
    
    const video = this.videoRef.nativeElement;
    try {
      const poses = await this.detector.estimatePoses(video);
      this.dibujarLandmarks(poses[0]?.keypoints || []);
      
      if (this.corrigiendo && poses[0] && this.manejador) {
        const res = this.manejador.manejarTecnica(poses[0].keypoints);
        this.procesarResultado(res);
      }
    } catch (error) {
      console.error('Error en detección de poses:', error);
    }
    
    this.idFrameAnimacion = requestAnimationFrame(() => this.bucleDeteccion());
  }

  public dibujarLandmarks(lm: poseDetection.Keypoint[]) {
    if (!this.canvasRef || !this.videoRef) return;
    
    const ctx = this.canvasRef.nativeElement.getContext('2d')!;
    const v = this.videoRef.nativeElement;
    ctx.clearRect(0, 0, v.clientWidth, v.clientHeight);
    
    const sx = v.clientWidth / (v.videoWidth || v.clientWidth);
    const sy = v.clientHeight / (v.videoHeight || v.clientHeight);
    
    lm.forEach(p => {
      if (p.x && p.y) {
        ctx.beginPath();
        ctx.arc(p.x * sx, p.y * sy, 5, 0, Math.PI * 2);
        ctx.fillStyle = this.colorRetroalimentacion || 'limegreen';
        ctx.fill();
      }
    });
  }

  public procesarResultado(r: ResultadoCorreccion) {
    if (r.mensaje) {
      this.retroalimentacion = r.mensaje;
      this.colorRetroalimentacion = r.color;
    }

    if (r.repContada) {
      this.repeticionesActuales = r.totalReps;
      this.resultados.push(r.color === 'green');
      this.mostrarFeedbackVisual(r.color === 'green');
      this.updateCirculos();
    }

    if (r.termino) {
      const exitosas = this.resultados.filter(v => v).length;
      this.ultimoPorcentaje = Math.round((exitosas / this.repeticionesEvaluacion) * 100);
      this.retroalimentacion = '';
      this.colorRetroalimentacion = '';
      this.resumenHtml = r.resumenHtml!;
      this.corrigiendo = false;
      this.mostrarBotonReintentar = true;
      
      // Verificar si el reto fue completado exitosamente
      if (this.ultimoPorcentaje >= 70) { // Umbral de éxito para retos
        this.retoCompletado = true;
        this.marcarRetoComoCompletado();
      }
    }
  }

  private mostrarFeedbackVisual(exitoso: boolean) {
    if (!this.canvasRef) return;
    
    // Cambiar temporalmente el borde del canvas
    const canvas = this.canvasRef.nativeElement;
    canvas.style.border = exitoso ? '3px solid #28a745' : '3px solid #dc3545';
    setTimeout(() => {
      canvas.style.border = '1px solid #ccc';
    }, 500);

    // Flash de pantalla
    const flashElement = document.createElement('div');
    flashElement.style.position = 'fixed';
    flashElement.style.top = '0';
    flashElement.style.left = '0';
    flashElement.style.width = '100%';
    flashElement.style.height = '100%';
    flashElement.style.backgroundColor = exitoso ? 'rgba(40, 167, 69, 0.3)' : 'rgba(220, 53, 69, 0.3)';
    flashElement.style.pointerEvents = 'none';
    flashElement.style.zIndex = '9999';
    flashElement.style.opacity = '1';
    flashElement.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(flashElement);
    
    setTimeout(() => {
      flashElement.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(flashElement)) {
          document.body.removeChild(flashElement);
        }
      }, 300);
    }, 200);
  }

  reintentar() {
    this.reintentos++;
    this.mostrarBotonReintentar = false;
    this.retroalimentacion = '';
    this.resumenHtml = '';
    this.retoCompletado = false;
    this.iniciar();
  }

  finalizarReto() {
    if (this.ultimoPorcentaje < 70 && this.reintentos < this.maxReintentos) {
      // Permitir reintento
      return;
    }

    this.detenerCamara();
    
    if (this.retoCompletado) {
      // Navegar a pantalla de éxito o dashboard
      this.router.navigate(['/dashboard']);
    } else {
      // Navegar a pantalla de retos o dashboard
      this.router.navigate(['/retos']);
    }
  }

  private marcarRetoComoCompletado() {
    /*
    if (this.reto && this.idUsuario) {
      this.retoService.completarReto(this.reto.id, this.idUsuario).subscribe({
        next: (response) => {
          console.log('Reto completado exitosamente:', response);
        },
        error: (err) => {
          console.error('Error al marcar reto como completado:', err);
        }
      });
    }
    */ 
  }

  public updateCirculos() {
    const selectors = [
      '.repeticiones-pc .circulo',
      '.repeticiones-mobile .circulo'
    ];
    
    selectors.forEach(sel => {
      const elems = document.querySelectorAll<HTMLElement>(sel);
      elems.forEach((div, idx) => {
        div.classList.remove('activo', 'correcto', 'incorrecto');
        if (idx < this.resultados.length) {
          div.classList.add('activo');
          div.classList.add(this.resultados[idx] ? 'correcto' : 'incorrecto');
        }
      });
    });
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
        if (this.reto && this.reto.nombre) {
          this.ejercicio = this.reto.nombre as NombreEjercicio;
          this.manejador = this.fabrica.obtenerManejador(this.ejercicio);
          this.nombreEjercicio = formatearNombreEjercicio(this.reto.nombre);
          
          // Configurar URL del video
          if (this.reto.video) {
            let rawVideoUrl = this.reto.video.trim();
            if (rawVideoUrl.includes('watch?v=')) {
              const videoId = rawVideoUrl.split('watch?v=')[1].split('&')[0];
              rawVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            }
            this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawVideoUrl);
          } else if (this.manejador) {
            this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.manejador.videoUrl);
          }
        }
      },
      error: (err: any) => console.error('Error al obtener el reto:', err)
    });
  }

  volver() {
    this.detenerCamara();
    this.router.navigate(['/retos']);
  }
}