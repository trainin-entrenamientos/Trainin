import type { Keypoint } from '@tensorflow-models/pose-detection';
import { ManejadorCorreccion } from '../../../compartido/interfaces/manejador-correccion.interface';
import { NombreEjercicio } from '../../../compartido/enums/nombre-ejercicio.enum';
import { ResultadoCorreccion } from '../../../compartido/interfaces/resultado-correccion.interface';
import { calcularAngulo, generarResumen, suavizar } from '../../../compartido/utilidades/correccion-postura.utils';

export class SentadillaBulgaraHandler implements ManejadorCorreccion {
  readonly nombreEjercicio = NombreEjercicio.SENTADILLA_BULGARA;
  readonly videoUrl        = 'https://www.youtube.com/embed/iaqHm0ODgss?autoplay=1&mute=1&loop=1&playlist=iaqHm0ODgss&controls=0&modestbranding=1&rel=0';

  private fase: 'down'|'up' = 'down';
  private lado: 'right'|'left'|null = null;
  private buffer: number[] = [];
  private total = 0;
  private resultados: boolean[] = [];

  private static readonly UMBRALES = {
    downKneeFront: 90,
    upKneeFront:   160,
    torsoTilt:     15
  };
  private static readonly BUFFER_SIZE = 5;

  private static readonly FEEDBACK_CFG = [
    {
      minPct: 100,
      titles: ['¡Bulgaras impecables!', 'Dominás la split squat', 'Máxima estabilidad'],
      tips: [
        'Mantené la cadera nivelada todo el tiempo.',
        'Controlá la bajada hasta 90° sin inclinar el torso.',
        'No dejes que la rodilla delantera pase la punta del pie.',
        'Sentí bien la carga en la pierna delantera.'
      ]
    },
    {
      minPct: 90,
      titles: ['Muy buena técnica', '¡Buen trabajo!', 'Casi perfecto'],
      tips: [
        'Apoyá bien el empeine trasero.',
        'No gires la cadera hacia un lado.',
        'Mantén la mirada al frente.',
        'Controla la subida sin impulso.'
      ]
    },
    {
      minPct: 80,
      titles: ['Técnica sólida', '¡Vas muy bien!', 'Buen ritmo'],
      tips: [
        'Baja hasta que la rodilla trasera casi toque el suelo.',
        'Evita inclinar el torso hacia adelante.',
        'Activa el abdomen para mayor estabilidad.',
        'Subí en línea recta sin oscilar.'
      ]
    },
    {
      minPct: 70,
      titles: ['Técnica aceptable', '¡Seguís mejorando!', 'Buen progreso'],
      tips: [
        'Acortá un poco el paso si perdés equilibrio.',
        'Mantén el peso centrado en el talón delantero.',
        'No encorves la espalda baja.',
        'Respirá constante durante el ejercicio.'
      ]
    },
    {
      minPct: 60,
      titles: ['Técnica intermedia', '¡Buen avance!', 'A un paso del óptimo'],
      tips: [
        'Practica sin peso para afianzar la forma.',
        'Mantén el tronco recto.',
        'Controla la bajada muy lentamente.',
        'Sentí la contracción en el glúteo y cuádriceps.'
      ]
    },
    {
      minPct: 50,
      titles: ['Técnica regular', '¡Vas por buen camino!', 'Requiere ajustes'],
      tips: [
        'Usá un apoyo más bajo hasta ganar estabilidad.',
        'Asegurá que la rodilla trasera baje controlada.',
        'No balancees el cuerpo.',
        'Observa tu técnica frente a un espejo.'
      ]
    },
    {
      minPct: 40,
      titles: ['Técnica básica', '¡Seguí practicando!', 'Ajustes necesarios'],
      tips: [
        'Reduce la profundidad de la bajada.',
        'Concéntrate en mantener la cadera estable.',
        'No dejes que la rodilla delantera avance demasiado.',
        'Practica con apoyo de una silla.'
      ]
    },
    {
      minPct: 30,
      titles: ['Técnica a mejorar', '¡Ánimo!', 'Enfocá la forma'],
      tips: [
        'Empieza sin peso para familiarizarte.',
        'Clava la rodilla trasera sin tocar el suelo.',
        'Mantén el tronco erguido.',
        'Controla cada fase lentamente.'
      ]
    },
    {
      minPct: 20,
      titles: ['Técnica débil', '¡Atención!', 'Volvé a lo básico'],
      tips: [
        'Practica la versión de estocada normal primero.',
        'Mantén el torso estable con ayuda de un soporte.',
        'Enfoca la contracción en la pierna delantera.',
        'Controla bien la bajada.'
      ]
    },
    {
      minPct: 10,
      titles: ['Técnica muy débil', '¡Necesita práctica!', 'Fundamentos primero'],
      tips: [
        'Embala menos profundidad: baja poco a poco.',
        'Usa una superficie más baja para el pie trasero.',
        'Activa el abdomen y glúteo antes de bajar.',
        'Fortalece tu equilibrio previo.'
      ]
    },
    {
      minPct: 0,
      titles: ['Técnica a revisar', '¡Empezá de cero!', 'Aprendé el patrón'],
      tips: [
        'Practica split squats sin elevación.',
        'Asegura un paso cómodo antes de elevar.',
        'Concéntrate en la alineación rodilla-pie.',
        'Gana estabilidad antes de profundizar.'
      ]
    }
  ];

  reset(): void {
    this.fase = 'down';
    this.lado = null;
    this.buffer = [];
    this.total = 0;
    this.resultados = [];
  }

  manejarTecnica(lm: Keypoint[]): ResultadoCorreccion {
    if (this.total >= 5) {
      return { mensaje: null, color: '', repContada: false, totalReps: this.total, termino: true };
    }

    if (!this.lado) {
      for (const side of ['right','left'] as const) {
        const hip  = lm.find(p => p.name === `${side}_hip`)!;
        const knee = lm.find(p => p.name === `${side}_knee`)!;
        const ank  = lm.find(p => p.name === `${side}_ankle`)!;
        const ang  = calcularAngulo(hip, knee, ank);
        if (ang <= SentadillaBulgaraHandler.UMBRALES.downKneeFront) {
          this.lado = side;
          break;
        }
      }
    }
    if (!this.lado) {
      return { mensaje: null, color: '', repContada: false, totalReps: this.total, termino: false };
    }

    const hip   = lm.find(p => p.name === `${this.lado}_hip`)!;
    const sh    = lm.find(p => p.name === `${this.lado}_shoulder`)!;
    const kneeF = lm.find(p => p.name === `${this.lado}_knee`)!;
    const ankF  = lm.find(p => p.name === `${this.lado}_ankle`)!;

    const raw = calcularAngulo(hip, kneeF, ankF);
    const ang = suavizar(this.buffer, raw, SentadillaBulgaraHandler.BUFFER_SIZE);

    let mensaje: string|null = null;
    let color: 'green'|'orange'|'red'|'' = '';
    let repContada = false;

    if (this.fase === 'down' && ang >= SentadillaBulgaraHandler.UMBRALES.upKneeFront) {
      this.fase = 'up';
      this.total++;
      repContada = true;

      const torsoAng = calcularAngulo(sh, hip, ankF);
      const tilt = Math.abs(180 - torsoAng);
      const esError = tilt > SentadillaBulgaraHandler.UMBRALES.torsoTilt;

      mensaje = esError
        ? 'Subida incorrecta: mantené el torso derecho'
        : '¡Bulgaras perfectas!';
      color = esError ? 'red' : 'green';
      this.resultados.push(!esError);
    }
    else if (this.fase === 'down' && ang > SentadillaBulgaraHandler.UMBRALES.downKneeFront) {
      mensaje = 'Subí un poco más hasta extensión casi completa';
      color   = 'orange';
    }
    else if (this.fase === 'up' && ang <= SentadillaBulgaraHandler.UMBRALES.downKneeFront) {
      this.fase = 'down';
      mensaje = 'Descenso controlado, rodilla a 90°';
      color   = 'orange';
    }

    const termino = this.total === 5;
    let resumenHtml: string|undefined;
    if (termino) {
      const { html } = generarResumen(
        this.resultados,
        SentadillaBulgaraHandler.FEEDBACK_CFG,
        5
      );
      resumenHtml = html;
    }

    return { mensaje, color, repContada, totalReps: this.total, termino, resumenHtml };
  }
}
