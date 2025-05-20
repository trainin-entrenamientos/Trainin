import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import type { Keypoint } from '@tensorflow-models/pose-detection';

@Component({
  selector: 'app-correccion-postura',
  standalone: false,
  templateUrl: './correccion-postura.component.html',
  styleUrls: ['./correccion-postura.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CorreccionPosturaComponent implements AfterViewInit, OnDestroy {

  @ViewChild('webcam', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('outputCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  detector: poseDetection.PoseDetector | null = null;
  camaraActiva = false;
  corrigiendo = false;

  private contexto!: CanvasRenderingContext2D;
  private idFrameAnimacion: number | null = null;
  totalRepeticiones: number;
  estado: 'arriba' | 'abajo';
  resultados: (boolean | 'hombro' | 'codo' | 'espalda' | 'rango' | 'otro')[] = [];
  repeticionesActuales: number;
  retroalimentacion: string;
  resumen: string;
  REPETICIONES_EVALUACION = 5;
  umbralBajada = 110;
  umbralSubida = 160;
  tamanoBuffer = 5;
  bufferAngulos: number[] = [];
  indicadorRepeticionActivo = false;
  ultimaRepeticionPerfecta = false;
  ultimaRepeticionConError = false;
  errorDetectado = false;
  colorRetroalimentacion = '';
  mostrarBotonIniciar = true;
  mostrarBotonReintentar = false;
  contador = 0;
  private errorRepeticionEnFrame = false;
  private mensajePorDefectoMostrado = false;
  private contextoAudio!: AudioContext;
  private contadorIntervalo: any;
  private feedbackConfig = [
  {
    minPct: 100,
    titles: ['¡Técnica Impecable!', '¡Sos muy bueno en esto!', 'Excelente ejecución'],
    tips: ['Mantené este nivel.', 'Segui así.']
  },
  {
    minPct: 90,
    titles: ['Muy Buena Técnica', '¡Buen Trabajo!', 'Casi perfecto'],
    tips: ['Revisá tu alineación de hombros.', 'Controlá tu respiración al subir.']
  },
  {
    minPct: 80,
    titles: ['Técnica Sólida', '¡Vas Muy Bien!', 'Buen Ritmo'],
    tips: ['No abras demasiado los codos.', 'Mantené la espalda neutra.']
  },
  {
    minPct: 70,
    titles: ['Técnica Aceptable', '¡Vas Mejorando!', 'Seguí Practicando'],
    tips: ['Trabajá tu rango completo de movimiento.', 'Cuidá la posición de tu torso.']
  },
  {
    minPct: 0,
    titles: ['Técnica a Mejorar', '¡Ánimo y Más Práctica!', 'Enfoca tu Postura'],
    tips: ['Empezá con menos peso.', 'Usá un espejo o compañero para feedback.']
  },
];


  /*SOLO DE PRUEBA*/
  private chosenVoice: SpeechSynthesisVoice | null = null;
  private feedbackQueue: { html: string, color: string }[] = [];
  private isSpeaking = false;

  ultimoErrorHombro = false;

  constructor() {
    this.corrigiendo = false;
    this.mostrarBotonIniciar = true;
    this.mostrarBotonReintentar = false;
    this.estado = 'arriba';
    this.totalRepeticiones = 0;
    this.repeticionesActuales = 0;
    this.retroalimentacion = '';
    this.resumen = '';
  }

  async ngAfterViewInit() {

     // 1) forzamos la carga inicial
    speechSynthesis.getVoices();
    // 2) cuando cambian —es decir, ya están disponibles— elegimos “Tomas”
    speechSynthesis.onvoiceschanged = () => this.pickVoice();
    // llamamos una vez por si ya estaba lista
    this.pickVoice();

    await this.crearDetector();
    await this.iniciarCamara();
    window.addEventListener('resize', this.manejarRedimension);
  }

  ngOnDestroy() {
    this.detenerCamara();
    window.removeEventListener('resize', this.manejarRedimension);
  }

  /** Se invoca al clickear play: muestra el countdown */
  iniciar() {
    this.contador = 5;

    this.contadorIntervalo = setInterval(() => {
      this.contador--;
      if (this.contador <= 0) {
        clearInterval(this.contadorIntervalo);
        this.contador = 0;
        this.mostrarBotonIniciar = false;
        this.iniciarCorreccion();
      }
    }, 1000);
  }


  /** Empieza la corrección de técnica */
  iniciarCorreccion() {
    this.corrigiendo = true;
    this.mostrarBotonIniciar = false;
    this.totalRepeticiones = 0;
    this.repeticionesActuales = 0;
    this.resultados = [];
    this.establecerRetroalimentacion('Recuerda no abrir tanto los codos.', 'orange');
    this.mensajePorDefectoMostrado = true;
    this.resumen = '';

    if (!this.contextoAudio) {
      this.contextoAudio = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.contextoAudio.resume();
    }
  }

  private manejarRedimension = () => {
    this.ajustarTamanoCanvas();
  };

  /** Genera un beep para feedback auditivo */
  private reproducirBeep(frecuencia = 440, duracion = 0.1) {
    const oscilador = this.contextoAudio.createOscillator();
    const ganancia = this.contextoAudio.createGain();
    oscilador.type = 'sine';
    oscilador.frequency.value = frecuencia;
    oscilador.connect(ganancia);
    ganancia.connect(this.contextoAudio.destination);
    oscilador.start();
    oscilador.stop(this.contextoAudio.currentTime + duracion);
  }

  /** Ajusta el tamaño del canvas al del video */
  private ajustarTamanoCanvas() {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
  }

  /** Carga el modelo de corrección de postura */
  private async crearDetector() {
    try {
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        { runtime: 'mediapipe', solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose' }
      );
    } catch (e) {
      console.warn('MediaPipe falló, usando TFJS:', e);
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        { runtime: 'tfjs', modelType: 'full' }
      );
    }
  }

  /** Accede a la cámara del usuario */
  private async iniciarCamara(intento = 0) {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Tu navegador no soporta cámara.');
      return;
    }
    const video = this.videoRef.nativeElement;
    this.contexto = this.canvasRef.nativeElement.getContext('2d')!;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.onloadedmetadata = () => this.ajustarTamanoCanvas();
      await video.play();
      this.ajustarTamanoCanvas();
      this.camaraActiva = true;
      this.bucleDeteccionPostura();
    } catch (error: any) {
      if (error.name === 'AbortError' && intento < 3) {
        console.warn('Timeout iniciando cámara, reintentando en 1 segundo...');
        setTimeout(() => this.iniciarCamara(intento + 1), 1000);
      } else {
        alert('No se pudo acceder a la cámara. Verifica permisos o reinicia el navegador.');
      }
    }
  }

  /** Detiene la cámara y limpia el canvas */
  private detenerCamara() {
    if (this.idFrameAnimacion) {
      cancelAnimationFrame(this.idFrameAnimacion);
      this.idFrameAnimacion = null;
    }
    const video = this.videoRef.nativeElement;
    if (video.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
    this.camaraActiva = false;
    this.contexto.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
  }

  /** Bucle continuo de estimación de postura */
  private async bucleDeteccionPostura() {
    if (!this.camaraActiva || !this.detector) return;

    const video = this.videoRef.nativeElement;

    try {
      const poses = await this.detector.estimatePoses(video);
      this.dibujarPostura(poses);

      // Sólo procesar técnica cuando corrigiendo === true
      if (this.corrigiendo && poses[0]) {
        this.manejarTecnica(poses[0].keypoints);
      }
    } catch (e) {
      console.warn('Error estimando postura:', e);
    }

    this.idFrameAnimacion = requestAnimationFrame(() => this.bucleDeteccionPostura());
  }

  /** Lógica de conteo y feedback de cada repetición */
  private manejarTecnica(lm: Keypoint[]) {
    // --- 1) Si ya llegamos al tope, salimos inmediatamente ---
    if (this.totalRepeticiones >= this.REPETICIONES_EVALUACION) {
      return;
    }

    const hombro = lm.find(p => p.name === 'right_shoulder');
    const codo = lm.find(p => p.name === 'right_elbow');
    const muneca = lm.find(p => p.name === 'right_wrist');
    if (!hombro || !codo || !muneca) return;

    const angBruto = this.calcularAngulo(hombro, codo, muneca);
    const angSuave = this.suavizar(this.bufferAngulos, angBruto);
    this.errorRepeticionEnFrame = false;

    if (this.estado === 'arriba' && angSuave < this.umbralBajada) {
      this.estado = 'abajo';
      const error = this.deteccionErrores(lm, 'abajo');
      this.establecerRetroalimentacion(error || '¡Descenso correcto! 👇', error ? 'orange' : 'green');

    } else if (this.estado === 'abajo' && angSuave > this.umbralSubida) {
      this.estado = 'arriba';
      const error = this.deteccionErrores(lm, 'arriba');
      this.ultimaRepeticionConError = !!error;

      if (error) {
        this.establecerRetroalimentacion('Subida incorrecta, tené cuidado', 'red');
        this.resultados.push(false);
        this.dispararFeedbackError();
        this.errorDetectado = true;
        this.errorRepeticionEnFrame = true;
      } else {
        this.establecerRetroalimentacion('¡Subida perfecta!', 'green');
        this.resultados.push(true);
        this.dispararFeedbackExito();
      }

      // --- 2) Solo incremento si aún no llegamos a 5 ---
      this.totalRepeticiones++;
      this.repeticionesActuales = this.totalRepeticiones;
      this.updateCirculos();

      // --- 3) Si justo alcanzamos 5, muestro resumen y detengo ---
      if (this.totalRepeticiones === this.REPETICIONES_EVALUACION) {
        this.mostrarResumen();
        // opcionalmente: this.corrigiendo = false; // ya lo hace mostrarResumen()
      }
    }

    if (!this.errorDetectado && !this.mensajePorDefectoMostrado) {
      this.establecerRetroalimentacion('Recuerda no abrir tanto los codos.', 'orange');
      this.mensajePorDefectoMostrado = true;
    }
  }


  /** Actualiza las clases CSS de los círculos según resultados */
  private updateCirculos() {
    const selectores = ['.repeticiones-pc .circulo', '.repeticiones-mobile .circulo'];
    selectores.forEach(sel => {
      const circulos = document.querySelectorAll<HTMLElement>(sel);
      circulos.forEach((div, i) => {
        div.classList.remove('activo', 'correcto', 'incorrecto');
        if (i < this.resultados.length) {
          div.classList.add('activo', this.resultados[i] ? 'correcto' : 'incorrecto');
        }
      });
    });
  }

  /** Suaviza una serie de valores */
  private suavizar(buffer: number[], valor: number): number {
    buffer.push(valor);
    if (buffer.length > this.tamanoBuffer) buffer.shift();
    return buffer.reduce((a, b) => a + b, 0) / buffer.length;
  }

  /** Dibuja los keypoints sobre el canvas */
  private dibujarPostura(poses: poseDetection.Pose[]) {
    const canvas = this.canvasRef.nativeElement;
    const video = this.videoRef.nativeElement;
    this.contexto.clearRect(0, 0, canvas.width, canvas.height);
    if (!poses.length) return;

    const escalaX = canvas.width / video.videoWidth;
    const escalaY = canvas.height / video.videoHeight;
    poses[0].keypoints.forEach(p => {
      const x = p.x * escalaX, y = p.y * escalaY;
      this.contexto.beginPath();
      this.contexto.arc(x, y, 6, 0, Math.PI * 2);
      this.contexto.fillStyle = this.errorRepeticionEnFrame ? 'red' : 'limegreen';
      this.contexto.fill();
    });
  }

  /** Calcula el ángulo entre tres puntos */
  private calcularAngulo(a: Keypoint, b: Keypoint, c: Keypoint): number {
    if ([a, b, c].some(pt => pt.x === undefined || pt.y === undefined)) {
      throw new Error('Coordenadas inválidas');
    }
    const ab = [a.x - b.x, a.y - b.y];
    const cb = [c.x - b.x, c.y - b.y];
    const dot = ab[0] * cb[0] + ab[1] * cb[1];
    const mag = Math.hypot(...ab) * Math.hypot(...cb);
    return Math.acos(dot / mag) * (180 / Math.PI);
  }

  finalizarPractica() {
    console.log('Práctica finalizada');
  }

  cerrarModal() {
    console.log('Modal cerrado');
  }

  /** Detecta errores de postura en fase subida/descenso */
  private deteccionErrores(lm: Keypoint[], fase: 'arriba' | 'abajo'): string | null {
    const hombro = lm.find(p => p.name === 'right_shoulder');
    const codo = lm.find(p => p.name === 'right_elbow');
    const cadera = lm.find(p => p.name === 'right_hip');
    if (!hombro || !codo || !cadera) return null;

    const angTorso = this.calcularAngulo(hombro, cadera, { x: cadera.x, y: cadera.y + 100 });
    if (Math.abs(codo.x - hombro.x) > 40) {
      this.ultimoErrorHombro = true;
      return 'Recuerda no abrir tanto los codos.';
    }
    this.ultimoErrorHombro = false;
    if (angTorso < 70) return 'Mantén la espalda recta.';

    const muneca = lm.find(p => p.name === 'right_wrist');
    if (!muneca) return null;
    const angBruto = this.calcularAngulo(hombro, codo, muneca);
    if (fase === 'abajo' && angBruto > this.umbralBajada) return 'Baja más el brazo antes de subir.';
    if (fase === 'arriba' && angBruto < this.umbralSubida) return 'Extiende completamente al subir.';
    return null;
  }

  private dispararFeedbackError() {
    this.reproducirBeep(220, 0.2);
    this.indicadorRepeticionActivo = true;
  }

  private dispararFeedbackExito() {
    this.reproducirBeep(880, 0.08);
    this.indicadorRepeticionActivo = true;
  }

 private mostrarResumen() {
  // 1) Cálculo de aciertos y porcentaje
  const exitosas = this.resultados.filter(r => r === true).length;
  const porcentaje = Math.round((exitosas / this.REPETICIONES_EVALUACION) * 100);

  // 2) Conteo de errores por tipo
  const errores = {
    hombros: this.resultados.filter(r => r === 'hombro').length,
    codos:    this.resultados.filter(r => r === 'codo').length,
    espalda:  this.resultados.filter(r => r === 'espalda').length,
    rango:    this.resultados.filter(r => r === 'rango').length,
    otros:    this.resultados.filter(r => r === 'otro').length,
  };

  // 3) Obtengo la configuración que corresponde a este porcentaje
  const cfg = this.feedbackConfig
    .sort((a, b) => b.minPct - a.minPct)
    .find(f => porcentaje >= f.minPct)!;

  // 4) Elijo un título al azar
  const titulo = cfg.titles[
    Math.floor(Math.random() * cfg.titles.length)
  ];

  // 5) Selecciono dos consejos base al azar
  const shuffledBase = [...cfg.tips].sort(() => 0.5 - Math.random());
  const baseTips = shuffledBase.slice(0, 2);

  // 6) Genero consejos de errores detectados
  const errorTips: string[] = [];
  if (errores.hombros) errorTips.push(`Corrige la alineación de hombros (${errores.hombros} error(es)).`);
  if (errores.codos)   errorTips.push(`Evita abrir demasiado los codos (${errores.codos} error(es)).`);
  if (errores.espalda) errorTips.push(`Mantén la espalda recta (${errores.espalda} error(es)).`);
  if (errores.rango)   errorTips.push(`Completa todo el rango de movimiento (${errores.rango} error(es)).`);
  if (errores.otros)   errorTips.push(`Otros errores: ${errores.otros}.`);

  // 7) Combino todos los consejos
  const consejos = [...baseTips, ...errorTips];

  // 8) Color según rango
  const claseColor = porcentaje === 100
    ? 'color-green'
    : porcentaje >= 70
      ? 'color-orange'
      : 'color-red';

  // 9) Construyo el HTML final
  const html = `
    <div class="resumen-container">
      <strong class="resumen-titulo ${claseColor}">
        ${titulo}
      </strong>
      <div class="resultado ${claseColor}">
        Resultado: ${porcentaje}% (${exitosas}/${this.REPETICIONES_EVALUACION})
      </div>
      <div class="resumen-consejos">
        ${consejos.map(t => `<div class="tip">${t}</div>`).join('')}
      </div>
    </div>
  `;

  // 10) Pinto y actualizo estado
  this.establecerRetroalimentacion(html, '');
  this.corrigiendo = false;
  this.mostrarBotonReintentar = true;
  this.mostrarBotonIniciar = false;
}

  /*private establecerRetroalimentacion(mensaje: string, color: string) {
    this.retroalimentacion = mensaje;
    this.colorRetroalimentacion = color;
  }*/

  reintentar() {
    this.totalRepeticiones = 0;
    this.repeticionesActuales = 0;
    this.resultados = [];
    this.updateCirculos();
    this.mostrarBotonIniciar = true;
    this.mostrarBotonReintentar = false;
    this.retroalimentacion = '';
    this.iniciarCorreccion();
  }

  cerrar() {
    console.log('Modal cerrado');
  }

  private applyFeedback(html: string, color: string) {
    this.retroalimentacion = html;
    this.colorRetroalimentacion = color;
  }

  /** Se quitan todos los tags HTML para que la voz lea solo texto */
  private stripHtml(html: string): string {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  private speakFeedback(text: string) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-ES';

    /*VOZ TOMAS*/
    if (this.chosenVoice) {
      utter.voice = this.chosenVoice;
    }
    utter.rate = 1.0;
    utter.pitch = 1.0;

    utter.onend = () => {
      this.isSpeaking = false;
      // cuando termina, si hay más en cola, los procesamos
      if (this.feedbackQueue.length) {
        const next = this.feedbackQueue.shift()!;
        this.applyFeedback(next.html, next.color);
        this.isSpeaking = true;
        this.speakFeedback(this.stripHtml(next.html));
      }
    };
    this.isSpeaking = true;
    speechSynthesis.speak(utter);
  }

  private establecerRetroalimentacion(html: string, color: string) {
    const textoPlano = this.stripHtml(html).trim();

    // Si es el mensaje por defecto, solo actualizamos UI y salimos
    if (textoPlano === 'Recuerda no abrir tanto los codos.') {
      this.applyFeedback(html, color);
      return;
    }

    // Si ya está hablando, encolamos
    if (this.isSpeaking) {
      this.feedbackQueue.push({ html, color });
    } else {
      // Si no, aplicamos y hablamos
      this.applyFeedback(html, color);
      this.speakFeedback(textoPlano);
    }
  }

  private pickVoice() {
    const voices = speechSynthesis.getVoices();
    this.chosenVoice = voices.find(v =>
      v.name.toLowerCase().includes('elena')
    ) || null;
  }
}
