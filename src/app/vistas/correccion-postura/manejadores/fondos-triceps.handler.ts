import type { Keypoint } from '@tensorflow-models/pose-detection';
import { ManejadorCorreccion } from '../../../compartido/interfaces/manejador-correccion.interface';
import { NombreEjercicio } from '../../../compartido/enums/nombre-ejercicio.enum';
import { ResultadoCorreccion } from '../../../compartido/interfaces/resultado-correccion.interface';
import { calcularAngulo, generarResumen, suavizar } from '../../../compartido/utilidades/correccion-postura.utils';

export class FondosTricepsHandler implements ManejadorCorreccion {
    readonly nombreEjercicio = NombreEjercicio.FONDOS_TRICEPS;
    readonly videoUrl = 'https://www.youtube.com/embed/F4u88tYU_20?autoplay=1&mute=1&loop=1&playlist=F4u88tYU_20&controls=0&modestbranding=1&rel=0';

    private fase: 'down' | 'up' = 'down';
    private brazo: 'right' | 'left' | null = null;
    private buffer: number[] = [];
    private total = 0;
    private resultados: boolean[] = [];

    private static readonly UMBRALES = {
        down: 160,
        up: 90,
        trunkLimit: 20
    };
    private static readonly BUFFER_SIZE = 5;

    private static readonly FEEDBACK_CFG = [
        {
            minPct: 100,
            titles: [
                '¡Fondos de campeón! 🏆',
                'Tríceps de acero 💪',
                'Ejecutaste a la perfección'
            ],
            tips: [
                'Mantené los codos pegados al cuerpo todo el tiempo.',
                'Controlá el descenso, bajá hasta 90° sin prisa.',
                'Subí con potencia pero sin bloquear las articulaciones.',
                'Sentí la contracción arriba del tríceps antes de estirar.'
            ]
        },
        {
            minPct: 90,
            titles: [
                '¡Muy buenos fondos!',
                'Casi perfecto',
                'Bien ejecutado'
            ],
            tips: [
                'Evita que el torso se desplace hacia adelante.',
                'No arquees demasiado la espalda baja.',
                'Exhalá al subir e inhalá al bajar.',
                'Mantené la mirada al frente, no hacia abajo.'
            ]
        },
        {
            minPct: 80,
            titles: [
                'Técnica sólida',
                'Vas muy bien',
                'Buen ritmo'
            ],
            tips: [
                'No uses impulso con el tronco para subir.',
                'Descendé un poco más hasta tocar 90°.',
                'Clavá los hombros hacia atrás.',
                'Sentí la tensión en el tríceps, no en el hombro.'
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
                'Controlá el movimiento en todo el arco.',
                'Mantené el core firme para estabilizarte.',
                'No dejes que los codos se abran demasiado.',
                'Practica bajadas lentas antes de subir rápido.'
            ]
        },
        {
            minPct: 60,
            titles: [
                'Técnica intermedia',
                'Buen avance',
                'A un paso del óptimo'
            ],
            tips: [
                'Reduce un poco la amplitud si pierdes estabilidad.',
                'Clavá los pies firme para no perder el equilibrio.',
                'Mantené los hombros bajos.',
                'Enfocate en bajar hasta el paralelo al suelo.'
            ]
        },
        {
            minPct: 50,
            titles: [
                'Técnica regular',
                'Vas por buen camino',
                'Requiere ajustes'
            ],
            tips: [
                'No uses las manos para impulsarte.',
                'Evita rebotar en el fondo del movimiento.',
                'Practica con un banco más alto para dominarlo.',
                'Controlá el torso: no se incline demasiado.'
            ]
        },
        {
            minPct: 40,
            titles: [
                'Técnica básica',
                'Seguí practicando',
                'Ajustes necesarios'
            ],
            tips: [
                'Empieza bajando menos y aumenta la profundidad.',
                'Mantén los codos cerca del torso.',
                'Activa el core para no arquear la espalda.',
                'Respira de forma constante, sin contener el aire.'
            ]
        },
        {
            minPct: 30,
            titles: [
                'Técnica a mejorar',
                'Ánimo y más práctica',
                'Enfocá tu postura'
            ],
            tips: [
                'Reduce el rango de movimiento si falla tu forma.',
                'Mantené los hombros quietos, mueve solo los brazos.',
                'Usá un banco más alto para tener asistencia.',
                'Sentí el tríceps trabajando, no el hombro.'
            ]
        },
        {
            minPct: 20,
            titles: [
                'Técnica débil',
                '¡Atención en la forma!',
                'Volvé a los básicos'
            ],
            tips: [
                'Practica con apoyo en las rodillas para dominar patrón.',
                'Clavá bien los codos para que no se abran.',
                'Usa una silla o banco para ayudarte.',
                'Controlá el torso: no te inclines hacia adelante.'
            ]
        },
        {
            minPct: 10,
            titles: [
                'Técnica muy débil',
                '¡Necesita práctica!',
                'Fundamentos primero'
            ],
            tips: [
                'Empieza apoyando los pies más alto para asistencia.',
                'Clavá el codo al costado antes de bajar mucho.',
                'No uses impulso con el tronco ni las piernas.',
                'Sentí la contracción del tríceps en cada subida.'
            ]
        },
        {
            minPct: 0,
            titles: [
                'Técnica a revisar',
                '¡Empezá desde cero!',
                'Aprendé el patrón'
            ],
            tips: [
                'Practica con bandas elásticas para ayudarte.',
                'Enfocate en bajar y subir despacio sin impulso.',
                'Mantén la espalda recta y los hombros bajos.',
                'Fortalece el core y estabilidad antes de cargar peso.'
            ]
        }
    ];

    reset(): void {
        this.fase = 'down';
        this.brazo = null;
        this.buffer = [];
        this.total = 0;
        this.resultados = [];
    }

    manejarTecnica(lm: Keypoint[]): ResultadoCorreccion {
        if (this.total >= 5) {
            return { mensaje: null, color: '', repContada: false, totalReps: this.total, termino: true };
        }

        if (!this.brazo) {
            for (const side of ['right', 'left'] as const) {
                const sh = lm.find(p => p.name === `${side}_shoulder`);
                const elb = lm.find(p => p.name === `${side}_elbow`);
                const wri = lm.find(p => p.name === `${side}_wrist`);
                if (!sh || !elb || !wri) continue;
                const angRaw = calcularAngulo(sh, elb, wri);
                if (angRaw > FondosTricepsHandler.UMBRALES.down) {
                    this.brazo = side;
                    break;
                }
            }
            if (!this.brazo) {
                return { mensaje: null, color: '', repContada: false, totalReps: this.total, termino: false };
            }
        }

        const hip = lm.find(p => p.name === `${this.brazo}_hip`);
        const sh = lm.find(p => p.name === `${this.brazo}_shoulder`);
        const elb = lm.find(p => p.name === `${this.brazo}_elbow`);
        const wri = lm.find(p => p.name === `${this.brazo}_wrist`);
        if (!hip || !sh || !elb || !wri) {
            return { mensaje: null, color: '', repContada: false, totalReps: this.total, termino: false };
        }

        const raw = calcularAngulo(sh, elb, wri);
        const ang = suavizar(this.buffer, raw, FondosTricepsHandler.BUFFER_SIZE);

        let mensaje: string | null = null;
        let color: 'green' | 'orange' | 'red' | '' = '';
        let repContada = false;

        if (this.fase === 'down' && ang <= FondosTricepsHandler.UMBRALES.up) {
            this.fase = 'up';

            const swing = Math.abs(sh.x - hip.x);
            const esError = swing > FondosTricepsHandler.UMBRALES.trunkLimit;

            mensaje = esError
                ? 'Descenso incorrecto: no movas el torso'
                : '¡Descenso perfecto!';
            color = esError ? 'red' : 'green';

            this.resultados.push(!esError);
            this.total++;
            repContada = true;
        }
        else if (this.fase === 'down' && ang < FondosTricepsHandler.UMBRALES.down) {
            if (ang > FondosTricepsHandler.UMBRALES.up) {
                mensaje = 'Bajá un poco más hasta los 90°';
                color = 'orange';
            }
        }
        else if (this.fase === 'up' && ang >= FondosTricepsHandler.UMBRALES.down) {
            this.fase = 'down';
            mensaje = 'Súbete con control';
            color = 'orange';
        }

        const termino = this.total === 5;
        let resumenHtml: string | undefined;
        if (termino) {
            const { html } = generarResumen(
                this.resultados,
                FondosTricepsHandler.FEEDBACK_CFG,
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
