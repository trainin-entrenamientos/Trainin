import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

import { NombreEjercicio } from '../../compartido/enums/nombre-ejercicio.enum';
import { FabricaManejadoresService } from '../../core/servicios/correccion-postura/fabrica-manejadores.service';
import { ManejadorCorreccion } from '../../compartido/interfaces/manejador-correccion.interface';
import { ResultadoCorreccion } from '../../compartido/interfaces/resultado-correccion.interface';
import { formatearNombreEjercicio, stripHtml } from '../../compartido/utilidades/correccion-postura.utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalReintentoCorreccionComponent } from '../../compartido/componentes/modales/modal-reintento-correccion/modal-reintento-correccion.component';
import { CorreccionDataService } from '../../core/servicios/correccion-postura/correccion-data.service';

@Component({
  standalone: false,
  selector: 'app-correccion-postura',
  templateUrl: './correccion-postura.component.html',
  styleUrls: ['./correccion-postura.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CorreccionPosturaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('webcam', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('outputCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private detector: poseDetection.PoseDetector | null = null;
  private idFrameAnimacion: number | null = null;
  camaraActiva = false;
  cargandoCamara = true;

  ejercicio!: NombreEjercicio;
  manejador!: ManejadorCorreccion;

  nombreEjercicio = '';
  videoUrl!: SafeResourceUrl;
  corrigiendo = false;
  mostrarBotonIniciar = true;
  mostrarBotonReintentar = false;
  repeticionesActuales = 0;
  retroalimentacion = '';
  colorRetroalimentacion = '';
  resumenHtml = '';
  ultimoPorcentaje = 0;
  reintentos = 0;
  maxReintentos = 3;
  resultados: boolean[] = [];

  contador = 0;

  readonly repeticionesEvaluacion = 5;
  circulos = Array(this.repeticionesEvaluacion);

  private contextoAudio!: AudioContext;
  private vozElegida: SpeechSynthesisVoice | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private fabrica: FabricaManejadoresService,
    private correccionData: CorreccionDataService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const clave = this.route.snapshot.paramMap.get('ejercicio') as NombreEjercicio;
    this.ejercicio = clave;
    this.manejador = this.fabrica.obtenerManejador(this.ejercicio);

    this.nombreEjercicio = formatearNombreEjercicio(this.ejercicio);

    const raw = sessionStorage.getItem('rutina');
    if (raw) {
      try {
        const datosRutina = JSON.parse(raw);
        const listaEjercicios: any[] = datosRutina.ejercicios || [];

        const entradaEjercicio = listaEjercicios.find(ej => {
          return ej.nombre.toLowerCase() === this.nombreEjercicio.toLowerCase();
        });

        if (entradaEjercicio && entradaEjercicio.video) {
          let rawVideoUrl: string = entradaEjercicio.video.trim();
          if (rawVideoUrl.includes('watch?v=')) {
            const videoId = rawVideoUrl.split('watch?v=')[1].split('&')[0];
            rawVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
          }
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawVideoUrl);
        } else {
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.manejador.videoUrl);
        }
      } catch (err) {
        console.error('Error parseando sessionStorage.rutina:', err);
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.manejador.videoUrl);
      }
    } else {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.manejador.videoUrl);
    }
  }

  async ngAfterViewInit() {
    this.contextoAudio = new (window.AudioContext || (window as any).webkitAudioContext)();
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => this.elegirVoz();
    this.elegirVoz();
    await this.crearDetector();
    await this.iniciarCamara();
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    this.detenerCamara();
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => {
    const v = this.videoRef.nativeElement;
    const c = this.canvasRef.nativeElement;
    c.width = v.clientWidth;
    c.height = v.clientHeight;
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
      }
    }
  }

  private detenerCamara() {
    if (this.idFrameAnimacion) cancelAnimationFrame(this.idFrameAnimacion);
    const video = this.videoRef.nativeElement;
    if (video.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
    this.camaraActiva = false;
  }

  iniciar() {
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
    if (!this.camaraActiva || !this.detector) return;
    const video = this.videoRef.nativeElement;
    const poses = await this.detector.estimatePoses(video);
    this.dibujarLandmarks(poses[0]?.keypoints || []);
    if (this.corrigiendo && poses[0]) {
      const res = this.manejador.manejarTecnica(poses[0].keypoints);
      this.procesarResultado(res);
    }
    this.idFrameAnimacion = requestAnimationFrame(() => this.bucleDeteccion());
  }

  public dibujarLandmarks(lm: poseDetection.Keypoint[]) {
    const ctx = this.canvasRef.nativeElement.getContext('2d')!;
    const v = this.videoRef.nativeElement;
    ctx.clearRect(0, 0, v.clientWidth, v.clientHeight);
    const sx = v.clientWidth / (v.videoWidth || v.clientWidth);
    const sy = v.clientHeight / (v.videoHeight || v.clientHeight);
    lm.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x! * sx, p.y! * sy, 5, 0, Math.PI * 2);
      ctx.fillStyle = this.colorRetroalimentacion || 'limegreen';
      ctx.fill();
    });
  }

  public procesarResultado(r: ResultadoCorreccion) {
    if (r.mensaje) {
      this.retroalimentacion = r.mensaje;
      this.colorRetroalimentacion = r.color;
      if (r.color === 'green' || r.color === 'red') {
        this.hablar(stripHtml(r.mensaje));
      }
    }

    if (r.repContada) {
      this.repeticionesActuales = r.totalReps;
      this.resultados.push(r.color === 'green');
      this.dispararBeep(r.color === 'green' ? 880 : 220);
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
      this.correccionData.registrarResultado(
        this.ejercicio,
        this.ultimoPorcentaje,
        this.reintentos
      );
      this.hablar(stripHtml(this.resumenHtml));
    }
  }

  private dispararBeep(freq: number) {
    const osc = this.contextoAudio.createOscillator();
    osc.frequency.value = freq;
    osc.connect(this.contextoAudio.destination);
    osc.start(); osc.stop(this.contextoAudio.currentTime + 0.1);
  }

  private hablar(texto: string) {
    const u = new SpeechSynthesisUtterance(texto);
    const vozAR = speechSynthesis.getVoices().find(v =>
      v.name.toLowerCase().includes('elena')
    ) || null;
    if (vozAR) u.voice = vozAR;
    u.lang = vozAR?.lang || 'es-ES';
    speechSynthesis.speak(u);
  }

  reintentar() {
    this.reintentos++;
    this.mostrarBotonReintentar = false;
    this.retroalimentacion = '';
    this.resumenHtml = '';
    this.iniciar();
  }


  finalizarPractica() {
    if (this.ultimoPorcentaje < 60) {
      if (this.reintentos < this.maxReintentos) {
        return;
      }

      const modalRef = this.modalService.open(ModalReintentoCorreccionComponent, {
        centered: true
      });
      modalRef.result.then(res => {
        if (res === 'continuar') {
          this.detenerCamara();
          this.router.navigate(['/realizar-ejercicio']);
        }
      });
      return;
    }

    this.detenerCamara();
    this.router.navigate(['/realizar-ejercicio']);
  }


  volver() {
    this.detenerCamara();
    this.router.navigate(['/informacion-ejercicio']);
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

  private elegirVoz() {
    const voces = speechSynthesis.getVoices();
    this.vozElegida = voces.find(v =>
      v.lang === 'es-AR' && /female|femenina/i.test(v.name)
    ) || null;
  }

}