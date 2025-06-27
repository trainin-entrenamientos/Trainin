import {
  Component,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { ActivatedRoute, Router } from '@angular/router';
import { NombreEjercicio } from '../../compartido/enums/nombre-ejercicio.enum';

@Component({
  standalone: false,
  selector: 'app-calibracion-camara',
  templateUrl: './calibracion-camara.component.html',
  styleUrls: ['./calibracion-camara.component.css'],
})
export class CalibracionCamaraComponent implements AfterViewInit, OnDestroy {
  @ViewChild('webcam', { static: false })
  videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('outputCanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  detector: poseDetection.PoseDetector | null = null;
  webcamRunning = false;
  correcting = false;
  cargandoCamara = true;

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  public clave: NombreEjercicio | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.clave = this.route.snapshot.paramMap.get(
      'ejercicio'
    ) as NombreEjercicio | null;
  }

  async ngAfterViewInit() {
    await this.createDetector();
    await this.startCam();

    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy() {
    this.detenerCamara();
    window.removeEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    this.adjustCanvasSize();
  };

  async createDetector() {
    try {
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        {
          runtime: 'mediapipe',
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
        }
      );
    } catch (e) {
      console.warn('MediaPipe falló, usando TFJS:', e);
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        { runtime: 'tfjs', modelType: 'full' }
      );
    }
  }

  async startCam(retryCount = 0) {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Tu navegador no soporta cámara.');
      return;
    }

    const video = this.videoRef.nativeElement;
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        this.adjustCanvasSize();
        this.cargandoCamara = false;
      };

      await video.play();
      this.adjustCanvasSize();

      this.webcamRunning = true;
      this.detectPoseLoop();
    } catch (err: any) {
      console.error('Error al iniciar cámara:', err);

      if (err.name === 'AbortError' && retryCount < 3) {
        console.warn('Timeout iniciando cámara, reintentando en 1 segundo...');
        setTimeout(() => this.startCam(retryCount + 1), 1000);
      } else {
        alert(
          'No se pudo acceder a la cámara. Verifica permisos, cierra otras aplicaciones que puedan usarla o reinicia el navegador.'
        );
      }
    }
  }

  detenerCamara() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    const video = this.videoRef.nativeElement;
    if (video.srcObject) {
      const tracks = (video.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
    this.webcamRunning = false;

    if (this.ctx) {
      const canvas = this.canvasRef.nativeElement;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  adjustCanvasSize() {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.style.width = video.clientWidth + 'px';
    canvas.style.height = video.clientHeight + 'px';
  }

  private lastFrameTime = 0;
  private readonly maxFPS = 30;

  async detectPoseLoop() {
    if (!this.webcamRunning || !this.detector) return;

    const video = this.videoRef.nativeElement;

    try {
      const poses = await this.detector.estimatePoses(video);
      this.drawPose(poses);
    } catch (e) {
      console.warn('Error estimando pose:', e);
    }

    this.animationFrameId = requestAnimationFrame(() => this.detectPoseLoop());
  }

  drawPose(poses: poseDetection.Pose[]) {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!poses || poses.length === 0) return;

    const keypoints = poses[0].keypoints;

    keypoints.forEach((point) => {
      const x = point.x;
      const y = point.y;

      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = 'limegreen';
      ctx.fill();
    });
  }

  cerrar() {
    this.detenerCamara();
  }

  volverARutina() {
    this.detenerCamara();
    this.router.navigate(['/informacion-ejercicio']);
  }
}
