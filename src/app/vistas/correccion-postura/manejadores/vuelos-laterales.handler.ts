import type { Keypoint } from '@tensorflow-models/pose-detection';
import { ManejadorCorreccion } from '../../../compartido/interfaces/manejador-correccion.interface';
import { NombreEjercicio } from '../../../compartido/enums/nombre-ejercicio.enum';
import { ResultadoCorreccion } from '../../../compartido/interfaces/resultado-correccion.interface';
import { calcularAngulo, generarResumen, suavizar } from '../../../compartido/utilidades/correccion-postura.utils';

export class VuelosLateralesHandler implements ManejadorCorreccion {
  readonly nombreEjercicio = NombreEjercicio.VUELOS_LATERALES;
  readonly videoUrl = 'https://www.youtube.com/embed/XYZdelVuelo?autoplay=1';

  private fase: 'down' | 'up' = 'down';
  private buffer: number[] = [];
  private total = 0;
  private resultados: boolean[] = [];

  // Umbrales
  private static readonly UMBRALES = {
    down: 20,    // ≤20° brazo abajo
    up: 85,    // ≥85° brazo paralelo
    elbow: 160   // ≥160° codo recto
  };
  private static readonly BUFFER_SIZE = 5;

  // ¡Este array NO puede estar vacío!
  private static readonly FEEDBACK_CFG = [
    {
      minPct: 100,
      titles: [
        '¡Técnica impecable!',
        'Dominás el press militar',
        'Tu ejecución es excelente'
      ],
      tips: [
        'Mantené este nivel de precisión en cada repetición.',
        'Controlá la respiración: exhalá al empujar e inhalá al descender.',
        'Alineá muñeca y codo para evitar tensiones.',
        'Activá el core y evitá cualquier balanceo del tronco.'
      ]
    },
    {
      minPct: 90,
      titles: [
        'Muy buena técnica',
        '¡Buen trabajo!',
        'Casi perfecto'
      ],
      tips: [
        'Revisá tu alineación de hombros frente a un espejo.',
        'No bloquees los codos al final del movimiento.',
        'Mantené los hombros relajados, sin encogerlos.',
        'Evita arquear la zona lumbar: activá el core durante todo el movimiento.'
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
        'No abras tanto los codos al descender el peso.',
        'Descendé con control, sin soltar la barra rápidamente.',
        'Llevá los brazos hasta paralelos al suelo.',
        'Mantené el cuello relajado y la mirada al frente.'
      ]
    },
    {
      minPct: 70,
      titles: [
        'Técnica aceptable',
        '¡Seguís mejorando!',
        'Buen progreso'
      ],
      tips: [
        'Trabajá rango completo de movimiento en cada repetición.',
        'Evita que la barra se desplace hacia adelante o atrás.',
        'Activá glúteos y core para mayor estabilidad.',
        'Concentrate en una trayectoria vertical de la barra.'
      ]
    },
    {
      minPct: 60,
      titles: [
        'Técnica intermedia',
        '¡Buen avance!',
        'A un paso del óptimo'
      ],
      tips: [
        'Sincronizá respiración y movimiento para mejor control.',
        'Mantené las muñecas firmes y rectas.',
        'No dejes que los codos sobresalgan exageradamente.',
        'Empujá con fuerza controlada, sin sacrificar la postura.'
      ]
    },
    {
      minPct: 50,
      titles: [
        'Técnica regular',
        '¡Vas por buen camino!',
        'Requiere algunos ajustes'
      ],
      tips: [
        'Colocá los pies al ancho de hombros para base estable.',
        'Evita desplazar el cuerpo hacia adelante al empujar.',
        'Mantené hombros abajo y atrás durante toda la serie.',
        'Usá un espejo o un compañero para observar tu alineación.'
      ]
    },
    {
      minPct: 40,
      titles: [
        'Técnica básica',
        '¡Seguí practicando!',
        'Ajustes necesarios'
      ],
      tips: [
        'Reduce un poco el peso para enfocarte en la forma.',
        'Realizá el movimiento de forma lenta y controlada.',
        'Mantené el tronco estable y sin balanceos.',
        'Activá el core antes de cada empuje.'
      ]
    },
    {
      minPct: 30,
      titles: [
        'Técnica a mejorar',
        '¡Ánimo y más práctica!',
        'Enfocá tu postura'
      ],
      tips: [
        'Empezá sólo con la barra o un palo para sentir el patrón.',
        'Concentra el movimiento en un recorrido parcial al principio.',
        'Mantén las muñecas rectas durante todo el ciclo.',
        'Hacé series lentas para reforzar la memoria muscular.'
      ]
    },
    {
      minPct: 20,
      titles: [
        'Técnica débil',
        '¡Atención en la forma!',
        'Concentrate en fundamentos'
      ],
      tips: [
        'Hacé el press sentado para trabajar el tronco estable.',
        'Practicá sin peso para perfeccionar el patrón de movimiento.',
        'Activá core y glúteos antes de cada repetición.',
        'Controlá cada fase: tres segundos para subir y bajar.'
      ]
    },
    {
      minPct: 10,
      titles: [
        'Técnica muy débil',
        '¡Enfocate en la postura!',
        'Volvé a los fundamentos'
      ],
      tips: [
        'Aprendé primero con un palo o barra vacía.',
        'Ejecutá “dumbbell press” para mejorar simetría.',
        'Reforzá la posición de codos y muñecas con poco peso.',
        'Trabajá planchas y hollow body para un core firme.'
      ]
    },
    {
      minPct: 0,
      titles: [
        'Técnica a revisar',
        '¡Empezá desde cero!',
        'Fundamentos primero'
      ],
      tips: [
        'Dominá el patrón con la barra vacía antes de sumar peso.',
        'Practicá frente a un espejo o con feedback de un compañero.',
        'Concéntrate en la posición correcta de muñecas y codos.',
        'Fortalecé el core con ejercicios de estabilidad como planchas.'
      ]
    }
  ];

  reset(): void {
    this.fase = 'down';
    this.buffer = [];
    this.total = 0;
    this.resultados = [];
  }

  manejarTecnica(lm: Keypoint[]): ResultadoCorreccion {
    // 1) Si ya completar 5, terminamos
    if (this.total >= 5) {
      return { mensaje: null, color: '', repContada: false, totalReps: this.total, termino: true };
    }

    // 2) Sacamos keypoints
    const hip = lm.find(p => p.name === 'right_hip')!;
    const sh = lm.find(p => p.name === 'right_shoulder')!;
    const elb = lm.find(p => p.name === 'right_elbow')!;
    const wri = lm.find(p => p.name === 'right_wrist')!;

    // 3) Calculamos ángulo y suavizamos
    const raw = calcularAngulo(hip, sh, elb);
    const ang = suavizar(this.buffer, raw, VuelosLateralesHandler.BUFFER_SIZE);

    let mensaje: string | null = null;
    let color: 'green' | 'orange' | 'red' | '' = '';
    let repContada = false;

    // A) SUBIDA completa → cuento rep, determino éxito/fallo y devuelvo feedback
    if (this.fase === 'down' && ang >= VuelosLateralesHandler.UMBRALES.up) {
      this.fase = 'up';
      this.total++;
      repContada = true;

      // comprobamos codo casi recto
      const elbowAng = calcularAngulo(sh, elb, wri);
      const esError = elbowAng < VuelosLateralesHandler.UMBRALES.elbow;

      mensaje = esError
        ? 'Elevación incorrecta: mantené el codo casi recto'
        : '¡Elevación correcta!';
      color = esError ? 'red' : 'green';

      this.resultados.push(!esError);
    }
    // B) Elevación parcial → sólo sugerencia
    else if (this.fase === 'down' && ang > VuelosLateralesHandler.UMBRALES.down) {
      mensaje = 'Elevá un poco más para completar el rango';
      color = 'orange';
    }
    // C) DESCENSO → cambio de fase y sugerencia, pero sin contar rep
    else if (this.fase === 'up' && ang <= VuelosLateralesHandler.UMBRALES.down) {
      this.fase = 'down';
      mensaje = 'Descenso controlado';
      color = 'orange';
    }

    // 4) Si justo alcanzamos 5 → generamos resumen
    const termino = this.total === 5;
    let resumenHtml: string | undefined;
    if (termino) {
      const { html } = generarResumen(
        this.resultados,
        VuelosLateralesHandler.FEEDBACK_CFG,
        5
      );
      resumenHtml = html;
    }

    return { mensaje, color, repContada, totalReps: this.total, termino, resumenHtml };
  }
}
