import type { Keypoint } from '@tensorflow-models/pose-detection';
import { ManejadorCorreccion } from '../../../compartido/interfaces/manejador-correccion.interface';
import { NombreEjercicio }     from '../../../compartido/enums/nombre-ejercicio.enum';
import { ResultadoCorreccion } from '../../../compartido/interfaces/resultado-correccion.interface';
import { generarResumen, suavizar } from '../../../compartido/utilidades/correccion-postura.utils';

export class SaltosTijeraHandler implements ManejadorCorreccion {
  readonly nombreEjercicio = NombreEjercicio.SALTOS_TIJERA;
  readonly videoUrl        = 'https://www.youtube.com/embed/_GMnNmWwYpg?autoplay=1&mute=1&loop=1&playlist=_GMnNmWwYpg&controls=0&modestbranding=1&rel=0';

  private fase: 'closed' | 'open' = 'closed';
  private buffer: number[] = [];
  private total = 0;
  private resultados: boolean[] = [];

  private static readonly UMBRALES = {
    legOpenFactor: 1.5,
    legCloseFactor: 1.2, 
  };
  private static readonly BUFFER_SIZE = 5;

  private static readonly FEEDBACK_CFG = [
    {
      minPct: 100,
      titles: [
        '¡Salto impecable!',
        'Máximo ritmo',
        'Dominás los jumping jacks'
      ],
      tips: [
        'Aterrizá suave con las puntas de los pies.',
        'Mantén el core firme todo el tiempo.',
        'Extiende brazos totalmente sin encoger hombros.',
        'Flexiona ligeramente las rodillas al caer.'
      ]
    },
    {
      minPct: 90,
      titles: [
        'Excelente salto',
        '¡Buen trabajo!',
        'Casi perfecto'
      ],
      tips: [
        'Abre bien las piernas al ancho de hombros.',
        'Controla la bajada sin golpear el suelo.',
        'Mantén la mirada al frente.',
        'Respira rítmico: exhala al abrir, inhala al cerrar.'
      ]
    },
    {
      minPct: 80,
      titles: [
        'Técnica sólida',
        '¡Vas muy bien!',
        'Buen ritmo'
      ],
      tips: [
        'No balances el tronco al saltar.',
        'Sube los brazos un poco más si puedes.',
        'Mantén la espalda recta.',
        'Aterriza con control, sin rebotar.'
      ]
    },
    {
      minPct: 70,
      titles: [
        'Técnica aceptable',
        '¡Sigues mejorando!',
        'Buen progreso'
      ],
      tips: [
        'Asegúrate de que ambas manos toquen arriba.',
        'Separa un poco más los pies si falta apertura.',
        'No encojas los hombros al subir los brazos.',
        'Controla tu respiración todo el tiempo.'
      ]
    },
    {
      minPct: 60,
      titles: [
        'Técnica intermedia',
        '¡Buen avance!',
        'Casi óptimo'
      ],
      tips: [
        'Sube los brazos hasta donde te sientas cómodo.',
        'Separa las piernas ligeramente más.',
        'Aterriza con rodillas algo flexionadas.',
        'Mantén un ritmo constante.'
      ]
    },
    {
      minPct: 50,
      titles: [
        'Técnica regular',
        '¡Vas por buen camino!',
        'Requiere ajustes'
      ],
      tips: [
        'Reduce la velocidad para controlar mejor.',
        'Practica primero sin salto, solo abertura.',
        'Fortalece tu core para más estabilidad.',
        'Mantén las rodillas alineadas con los pies.'
      ]
    },
    {
      minPct: 40,
      titles: [
        'Técnica básica',
        '¡Sigue practicando!',
        'Ajustes necesarios'
      ],
      tips: [
        'Realiza movimientos más pequeños al principio.',
        'Fíjate en un espejo para ajustar postura.',
        'Mantén caderas niveladas.',
        'Inicia abriendo solo brazos o solo piernas.'
      ]
    },
    {
      minPct: 30,
      titles: [
        'Técnica a mejorar',
        '¡Ánimo!',
        'Enfoca la forma'
      ],
      tips: [
        'Separa sin salto para dominar la coordinación.',
        'Flexiona ligeramente rodillas al aterrizar.',
        'Mantén core y glúteos activados.',
        'Practica en cámara lenta antes de ritmo completo.'
      ]
    },
    {
      minPct: 20,
      titles: [
        'Técnica débil',
        '¡Atención!',
        'Volvé a lo básico'
      ],
      tips: [
        'Comienza sin salto: abre piernas y brazos por separado.',
        'Presta atención a la sincronía brazos–piernas.',
        'Mantén tronco estable y sin balanceos.',
        'Fortalece tu estabilidad con mini-saltos.'
      ]
    },
    {
      minPct: 10,
      titles: [
        'Técnica muy débil',
        'Necesita práctica',
        'Fundamentos primero'
      ],
      tips: [
        'Practica solo el movimiento de brazos.',
        'Luego, separa solo las piernas.',
        'Combinalos cuando domines ambas partes.',
        'Trabaja core y equilibrio antes de añadir salto.'
      ]
    },
    {
      minPct: 0,
      titles: [
        'Técnica a revisar',
        '¡Empezá desde cero!',
        'Aprende el patrón'
      ],
      tips: [
        'Descompone el ejercicio: brazos y piernas por separado.',
        'Controla cada posición antes de saltar.',
        'Fortalece core y glúteos con ejercicios de apoyo.',
        'Revisa tu postura frente a un espejo.'
      ]
    }
  ];

  reset(): void {
    this.fase = 'closed';
    this.buffer = [];
    this.total = 0;
    this.resultados = [];
  }

  manejarTecnica(lm: Keypoint[]): ResultadoCorreccion {
    if (this.total >= 5) {
      return {
        mensaje: null,
        color: '',
        repContada: false,
        totalReps: this.total,
        termino: true
      };
    }

    const ls = lm.find(p => p.name === 'left_shoulder')!;
    const rs = lm.find(p => p.name === 'right_shoulder')!;
    const la = lm.find(p => p.name === 'left_ankle')!;
    const ra = lm.find(p => p.name === 'right_ankle')!;
    const lw = lm.find(p => p.name === 'left_wrist')!;
    const rw = lm.find(p => p.name === 'right_wrist')!;

    const shoulderDist = Math.abs(ls.x - rs.x);
    const ankleDist    = Math.abs(la.x - ra.x);
    const rawRatio     = ankleDist / (shoulderDist || 1);
    const ratio        = suavizar(this.buffer, rawRatio, SaltosTijeraHandler.BUFFER_SIZE);

    const legsOpen   = ratio >= SaltosTijeraHandler.UMBRALES.legOpenFactor;
    const legsClosed = ratio <= SaltosTijeraHandler.UMBRALES.legCloseFactor;
    const armsUp     = lw.y < ls.y && rw.y < rs.y;
    const armsDown   = lw.y > ls.y && rw.y > rs.y;

    let mensaje: string|null = null;
    let color: 'green'|'orange'|'red'|'' = '';
    let repContada = false;

    if (this.fase === 'closed' && legsOpen && armsUp) {
      this.fase = 'open';
      this.total++;
      repContada = true;
      mensaje = '¡Buen salto!';
      color   = 'green';
      this.resultados.push(true);
    }
    else if (this.fase === 'closed' && (legsOpen || armsUp)) {
      mensaje = 'Abre bien piernas y brazos';
      color   = 'orange';
    }
    else if (this.fase === 'open' && legsClosed && armsDown) {
      this.fase = 'closed';
      mensaje = 'Volvé a posición inicial';
      color   = 'orange';
    }

    const termino = this.total === 5;
    let resumenHtml: string|undefined;
    if (termino) {
      const { html } = generarResumen(
        this.resultados,
        SaltosTijeraHandler.FEEDBACK_CFG,
        5
      );
      resumenHtml = html;
    }

    return {
      mensaje,
      color,
      repContada,
      totalReps: this.total,
      termino,
      resumenHtml
    };
  }
}
