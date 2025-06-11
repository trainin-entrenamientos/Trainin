import type { Keypoint } from '@tensorflow-models/pose-detection';
import { ManejadorCorreccion } from '../../../compartido/interfaces/manejador-correccion.interface';
import { NombreEjercicio } from '../../../compartido/enums/nombre-ejercicio.enum';
import { ResultadoCorreccion } from '../../../compartido/interfaces/resultado-correccion.interface';
import { calcularAngulo, generarResumen, suavizar } from '../../../compartido/utilidades/correccion-postura.utils';

export class EstocadaHandler implements ManejadorCorreccion {
  readonly nombreEjercicio = NombreEjercicio.ESTOCADA;
  readonly videoUrl        = 'https://www.youtube.com/embed/Sw7Lc0bk3EQ?autoplay=1&mute=1&loop=1&playlist=Sw7Lc0bk3EQ&controls=0&modestbranding=1&rel=0';

  private fase: 'down'|'up' = 'down';
  private lado: 'right'|'left'|null = null;
  private buffer: number[] = [];
  private total = 0;
  private resultados: boolean[] = [];

  private static readonly UMBRALES = {
    downKnee: 90,
    upKnee: 170,
    torsoTilt: 15
  };
  private static readonly BUFFER_SIZE = 5;

  private static readonly FEEDBACK_CFG = [
    { minPct:100, titles:['¡Estocadas perfectas!','Dominás la estocada','Máxima precisión'], tips:[
        'Mantené el torso bien erguido en todo el recorrido.',
        'Controlá tu respiración: exhalá al subir, inhalá al bajar.',
        'Asegurate de que la rodilla no sobrepase la punta del pie.',
        'El talón trasero debe quedar levantado y la pierna atrás estable.'
      ]
    },
    { minPct:90, titles:['Muy buena técnica','¡Buen trabajo!','Casi perfecto'], tips:[
        'No inclines demasiado el torso hacia adelante.',
        'Mantené el pie delantero firme y estable.',
        'Controlá la bajada para no golpear la rodilla contra el suelo.',
        'La mirada siempre hacia adelante, no al piso.'
      ]
    },
    { minPct:80, titles:['Técnica sólida','¡Vas muy bien!','Buen ritmo'], tips:[
        'Flexioná la rodilla justo hasta 90°.',
        'Evita que la rodilla trasera toque el suelo.',
        'Mantené los hombros relajados y atrás.',
        'Sentí la contracción de cuádriceps y glúteo al subir.'
      ]
    },
    { minPct:70, titles:['Técnica aceptable','¡Seguís mejorando!','Buen progreso'], tips:[
        'Mirá hacia adelante y mantené el pecho erguido.',
        'No dejes que el pie delantero gire de más.',
        'Controlá la extensión de la pierna trasera al subir.',
        'Activá el núcleo para mayor estabilidad.'
      ]
    },
    { minPct:60, titles:['Técnica intermedia','¡Buen avance!','A un paso del óptimo'], tips:[
        'Bajá un poco más si no llegás a 90°.',
        'Mantené el tronco firme, sin balanceos.',
        'Asegurate de pisar con firmeza el pie trasero.',
        'Respirá de forma constante durante el ejercicio.'
      ]
    },
    { minPct:50, titles:['Técnica regular','¡Vas por buen camino!','Requiere ajustes'], tips:[
        'Reducí el paso si no tenés control.',
        'Mantene la rodilla alineada con el pie delantero.',
        'No balanceés el tronco al subir.',
        'Usá un espejo para chequear tu alineación.'
      ]
    },
    { minPct:40, titles:['Técnica básica','¡Seguí practicando!','Ajustes necesarios'], tips:[
        'Practica sin peso hasta sentirte estable.',
        'Clava la rodilla trasera sin tocar el suelo.',
        'Mantené la espalda recta.',
        'Concentra el movimiento en la pierna delantera.'
      ]
    },
    { minPct:30, titles:['Técnica a mejorar','¡Ánimo!','Enfocá la forma'], tips:[
        'Acortá el paso para más control.',
        'Sentí bien el músculo al subir.',
        'Evita inclinar el torso demasiado adelante.',
        'Controlá la bajada, no dejes caer la cadera.'
      ]
    },
    { minPct:20, titles:['Técnica débil','¡Atención!','Volvé a lo básico'], tips:[
        'Practica primero sin peso y paso pequeño.',
        'Clavá la rodilla trasera sin balanceos.',
        'Subí despacio para sentir el músculo.',
        'Asegurate que la rodilla no supere el pie.'
      ]
    },
    { minPct:10, titles:['Técnica muy débil','¡Necesita práctica!','Fundamentos primero'], tips:[
        'Hacé estocadas con asistencia (silla/o pared).',
        'Mantén la mirada al frente y pecho erguido.',
        'Sentí la contracción al subir lentamente.',
        'Reforzá estabilidad practicando balance.'
      ]
    },
    { minPct:0, titles:['Técnica a revisar','¡Empezá de cero!','Aprendé el patrón'], tips:[
        'Practica el paso sin bajar tanto.',
        'Subí solo un poco hasta ganar confianza.',
        'Concéntrate en clavar la rodilla trasera.',
        'Fortalecé estabilidad antes de profundizar.'
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
      return { mensaje: null, color:'', repContada:false, totalReps:this.total, termino:true };
    }

    if (!this.lado) {
      for (const side of ['right','left'] as const) {
        const hip  = lm.find(p=>p.name===`${side}_hip`)!;
        const knee = lm.find(p=>p.name===`${side}_knee`)!;
        const ank  = lm.find(p=>p.name===`${side}_ankle`)!;
        const ang  = calcularAngulo(hip, knee, ank);
        if (ang <= EstocadaHandler.UMBRALES.downKnee) {
          this.lado = side;
          break;
        }
      }
    }
    if (!this.lado) {
      return { mensaje:null, color:'', repContada:false, totalReps:this.total, termino:false };
    }

    const hip  = lm.find(p=>p.name===`${this.lado}_hip`)!;
    const sh   = lm.find(p=>p.name===`${this.lado}_shoulder`)!;
    const knee = lm.find(p=>p.name===`${this.lado}_knee`)!;
    const ank  = lm.find(p=>p.name===`${this.lado}_ankle`)!;

    const raw  = calcularAngulo(hip, knee, ank);
    const ang  = suavizar(this.buffer, raw, EstocadaHandler.BUFFER_SIZE);

    let mensaje: string|null = null;
    let color:  'green'|'orange'|'red'|'' = '';
    let repContada = false;

    if (this.fase==='down' && ang >= EstocadaHandler.UMBRALES.upKnee) {
      this.fase = 'up';
      this.total++;
      repContada = true;

      const torsoAng = calcularAngulo(sh, hip, ank);
      const tilt = Math.abs(180 - torsoAng);
      const esError = tilt > EstocadaHandler.UMBRALES.torsoTilt;

      mensaje = esError
        ? 'Subida incorrecta: mantené el torso derecho'
        : '¡Estocada perfecta!';
      color = esError ? 'red' : 'green';

      this.resultados.push(!esError);
    }
    else if (this.fase==='down' && ang > EstocadaHandler.UMBRALES.downKnee) {
      mensaje = 'Subí un poco más hasta casi extensión completa';
      color   = 'orange';
    }
    else if (this.fase==='up' && ang <= EstocadaHandler.UMBRALES.downKnee) {
      this.fase = 'down';
      mensaje = 'Descenso controlado, rodilla a 90°';
      color   = 'orange';
    }

    const termino = this.total===5;
    let resumenHtml: string|undefined;
    if (termino) {
      const { html } = generarResumen(
        this.resultados,
        EstocadaHandler.FEEDBACK_CFG,
        5
      );
      resumenHtml = html;
    }

    return { mensaje, color, repContada, totalReps:this.total, termino, resumenHtml };
  }
}
