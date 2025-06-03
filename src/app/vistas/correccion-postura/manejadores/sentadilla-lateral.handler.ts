import type { Keypoint } from '@tensorflow-models/pose-detection';
import { ManejadorCorreccion } from '../../../compartido/interfaces/manejador-correccion.interface';
import { NombreEjercicio }     from '../../../compartido/enums/nombre-ejercicio.enum';
import { ResultadoCorreccion } from '../../../compartido/interfaces/resultado-correccion.interface';
import { calcularAngulo, generarResumen, suavizar } from '../../../compartido/utilidades/correccion-postura.utils';

export class SentadillaLateralHandler implements ManejadorCorreccion {
  readonly nombreEjercicio = NombreEjercicio.SENTADILLA_LATERAL;
  readonly videoUrl        = 'https://www.youtube.com/embed/XYZsentadillaLateral?autoplay=1';

  private fase: 'down'|'up'      = 'down';
  private pierna: 'right'|'left' | null = null;
  private buffer: number[]       = [];
  private total = 0;
  private resultados: boolean[]  = [];

  // Umbrales
  private static readonly UMBRALES = {
    down:        100,
    up:          160,
    trunkLimit:   20
  };
  private static readonly BUFFER_SIZE = 5;

  private static readonly FEEDBACK_CFG = [
    { minPct:100, titles:['¡Sentadilla lateral impecable!'], tips:['Mantené la espalda bien recta.','Controlá cada fase del movimiento.'] },
    { minPct:80,  titles:['Muy buen trabajo'], tips:['Intentá bajar un toque más sin perder la espalda.','Mantén el core activo.'] },
    { minPct:60,  titles:['Técnica aceptable'], tips:['No dejes que tu rodilla se vaya hacia adentro.','Controlá la bajada.'] },
    { minPct:0,   titles:['A mejorar'], tips:['Practica sin peso para sentir el patrón.','No te inclines demasiado al costado.'] }
  ];

  reset(): void {
    this.fase    = 'down';
    this.pierna  = null;
    this.buffer  = [];
    this.total   = 0;
    this.resultados = [];
  }

  manejarTecnica(lm: Keypoint[]): ResultadoCorreccion {
    if (this.total >= 5) {
      return { mensaje: null, color:'', repContada:false, totalReps:this.total, termino:true };
    }

    if (!this.pierna) {
      for (const side of ['right','left'] as const) {
        const hip = lm.find(p=>p.name===`${side}_hip`);
        const kne = lm.find(p=>p.name===`${side}_knee`);
        const ank = lm.find(p=>p.name===`${side}_ankle`);
        if (!hip||!kne||!ank) continue;
        const angKnee = calcularAngulo(hip,kne,ank);
        if (angKnee < SentadillaLateralHandler.UMBRALES.down) {
          this.pierna = side;
          break;
        }
      }
      if (!this.pierna) {
        return { mensaje:null, color:'', repContada:false, totalReps:this.total, termino:false };
      }
    }

    const hip = lm.find(p=>p.name===`${this.pierna}_hip`);
    const kne = lm.find(p=>p.name===`${this.pierna}_knee`);
    const ank = lm.find(p=>p.name===`${this.pierna}_ankle`);
    const sh  = lm.find(p=>p.name==='left_shoulder');
    const sh2 = lm.find(p=>p.name==='right_shoulder');
    if (!hip||!kne||!ank||!sh||!sh2) {
      return { mensaje:null, color:'', repContada:false, totalReps:this.total, termino:false };
    }

    // Calculo y suavizo el ángulo de rodilla
    const raw = calcularAngulo(hip, kne, ank);
    const ang = suavizar(this.buffer, raw, SentadillaLateralHandler.BUFFER_SIZE);

    let mensaje: string|null = null;
    let color: 'green'|'orange'|'red'|'' = '';
    let repContada = false;

    if (this.fase==='down' && ang < SentadillaLateralHandler.UMBRALES.down) {
      this.fase = 'up';

      // Chequeo desplazamiento lateral del tronco
      const midShoulderX = (sh.x + sh2.x)/2;
      const displacement = Math.abs(midShoulderX - hip.x);
      const esError = displacement > SentadillaLateralHandler.UMBRALES.trunkLimit;

      mensaje = esError
        ? 'Bajada incorrecta: mantené el tronco estable'
        : '¡Bajada perfecta!';
      color = esError ? 'red' : 'green';

      this.resultados.push(!esError);
      this.total++;
      repContada = true;
    }
    else if (this.fase==='down' && ang < SentadillaLateralHandler.UMBRALES.up) {
      mensaje = 'Bajá un poco más la rodilla';
      color   = 'orange';
    }
    else if (this.fase==='up' && ang > SentadillaLateralHandler.UMBRALES.up) {
      this.fase = 'down';
      mensaje = 'Subí con control';
      color   = 'orange';
    }

    // Genero resumen al completar 5 repeticiones
    const termino = this.total===5;
    let resumenHtml: string|undefined;
    if (termino) {
      const { html } = generarResumen(
        this.resultados,
        SentadillaLateralHandler.FEEDBACK_CFG,
        5
      );
      resumenHtml = html;
    }

    return { mensaje, color, repContada, totalReps:this.total, termino, resumenHtml };
  }
}
