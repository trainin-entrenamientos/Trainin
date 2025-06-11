import type { Keypoint } from '@tensorflow-models/pose-detection';
import { ManejadorCorreccion } from '../../../compartido/interfaces/manejador-correccion.interface';
import { NombreEjercicio }     from '../../../compartido/enums/nombre-ejercicio.enum';
import { ResultadoCorreccion } from '../../../compartido/interfaces/resultado-correccion.interface';
import { calcularAngulo, generarResumen, suavizar } from '../../../compartido/utilidades/correccion-postura.utils';

export class AbduccionCaderaHandler implements ManejadorCorreccion {
  readonly nombreEjercicio = NombreEjercicio.ABDUCCION_CADERA;
  readonly videoUrl        = 'https://www.youtube.com/embed/-Cr8dmyJHBQ?autoplay=1&mute=1&loop=1&playlist=-Cr8dmyJHBQ&controls=0&modestbranding=1&rel=0';

  private fase: 'down'|'up'                = 'down';
  private pierna: 'right'|'left' | null    = null;
  private buffer: number[]                = [];
  private total = 0;
  private resultados: boolean[]           = [];

  private static readonly UMBRALES = {
    down:      100,
    up:        155,
    trunkLimit: 30
};
  private static readonly BUFFER_SIZE = 5;

  private static readonly FEEDBACK_CFG = [
    {
      minPct: 100,
      titles: [
        '¡Abducción perfecta!',
        'Dominás el movimiento',
        'Genial elevación'
      ],
      tips: [
        'Mantené la espalda bien pegada a la pared.',
        'Controlá la subida y la bajada sin impulso.',
        'Sentí bien el trabajo del glúteo y costado.',
        'Sostené la zona abdominal para no inclinar el torso.'
      ]
    },
    {
      minPct: 80,
      titles: [
        'Muy buena elevación',
        '¡Vas excelente!',
        'Casi perfecto'
      ],
      tips: [
        'No pierdas el contacto con la pared.',
        'Evita balancear el tronco para ganar altura.',
        'Subí un poco más para completar el rango.',
        'Mantén la cadera estable, sin rotar.'
      ]
    },
    {
      minPct: 60,
      titles: [
        'Técnica aceptable',
        '¡Vas mejorando!',
        'Buen ritmo'
      ],
      tips: [
        'Bajá despacio y subí con control.',
        'Clavá bien el pie de apoyo para estabilidad.',
        'No levantes la cadera: mantenela alineada.',
        'Activá la zona media (abdominales) todo el tiempo.'
      ]
    },
    {
      minPct: 0,
      titles: [
        'A mejorar',
        '¡Enfocate en la técnica!',
        'Vamos desde cero'
      ],
      tips: [
        'Practica sin peso para sentir el patrón.',
        'Perseguí que el tronco no se desplace.',
        'Enfocate en levantar con el glúteo, no con el torso.',
        'Mantén siempre la espalda pegada a la pared.'
      ]
    }
  ];

  reset(): void {
    this.fase     = 'down';
    this.pierna   = null;
    this.buffer   = [];
    this.total    = 0;
    this.resultados = [];
  }

  manejarTecnica(lm: Keypoint[]): ResultadoCorreccion {
    if (this.total >= 5) {
      return { mensaje: null, color: '', repContada: false, totalReps: this.total, termino: true };
    }

    if (!this.pierna) {
      for (const side of ['right','left'] as const) {
        const sh  = lm.find(p => p.name === `${side}_shoulder`);
        const hip = lm.find(p => p.name === `${side}_hip`);
        const kne = lm.find(p => p.name === `${side}_knee`);
        if (!sh || !hip || !kne) continue;
        const ang0 = calcularAngulo(sh, hip, kne);
        if (ang0 < AbduccionCaderaHandler.UMBRALES.down) {
          this.pierna = side;
          break;
        }
      }
    }
    if (!this.pierna) {
      return { mensaje: null, color: '', repContada: false, totalReps: this.total, termino: false };
    }

    const shL = lm.find(p => p.name==='left_shoulder')!;
    const shR = lm.find(p => p.name==='right_shoulder')!;
    const shMidX = (shL.x + shR.x)/2;

    const sh  = lm.find(p => p.name === `${this.pierna}_shoulder`)!;
    const hip = lm.find(p => p.name === `${this.pierna}_hip`)!;
    const kne = lm.find(p => p.name === `${this.pierna}_knee`)!;

    const raw = calcularAngulo(sh, hip, kne);
    const ang = suavizar(this.buffer, raw, AbduccionCaderaHandler.BUFFER_SIZE);

    let mensaje: string|null = null;
    let color: 'green'|'orange'|'red'|'' = '';
    let repContada = false;

    if (this.fase === 'down' && ang <= AbduccionCaderaHandler.UMBRALES.up) {
      this.fase = 'up';

      const swing = Math.abs(shMidX - hip.x);
      const esError = swing > AbduccionCaderaHandler.UMBRALES.trunkLimit;

      mensaje = esError
        ? 'Elevación incorrecta: evitá mover el tronco'
        : '¡Elevación perfecta!';
      color = esError ? 'red' : 'green';

      this.resultados.push(!esError);
      this.total++;
      repContada = true;
    }
    else if (this.fase === 'down' && ang < AbduccionCaderaHandler.UMBRALES.down) {
      mensaje = ang < AbduccionCaderaHandler.UMBRALES.up
        ? 'Elevá un poco más la pierna'
        : null;
      color = 'orange';
    }
    else if (this.fase === 'up' && ang > AbduccionCaderaHandler.UMBRALES.up) {
      this.fase = 'down';
      mensaje = 'Bajá con control';
      color = 'orange';
    }

    const termino = this.total === 5;
    let resumenHtml: string|undefined;
    if (termino) {
      const { html } = generarResumen(
        this.resultados,
        AbduccionCaderaHandler.FEEDBACK_CFG,
        5
      );
      resumenHtml = html;
    }

    return { mensaje, color, repContada, totalReps: this.total, termino, resumenHtml };
  }
}
