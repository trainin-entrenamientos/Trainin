import type { Keypoint } from '@tensorflow-models/pose-detection';
import { ManejadorCorreccion } from '../../../compartido/interfaces/manejador-correccion.interface';
import { NombreEjercicio } from '../../../compartido/enums/nombre-ejercicio.enum';
import { ResultadoCorreccion } from '../../../compartido/interfaces/resultado-correccion.interface';
import { calcularAngulo, generarResumen, suavizar } from '../../../compartido/utilidades/correccion-postura.utils';

export class CurlBicepsHandler implements ManejadorCorreccion {
    readonly nombreEjercicio = NombreEjercicio.CURL_BICEPS;
    readonly videoUrl = 'https://www.youtube.com/embed/XYZcurlBiceps?autoplay=1';

    private fase: 'down' | 'up' = 'down';
    private brazo: 'right' | 'left' | null = null;
    private buffer: number[] = [];
    private total = 0;
    private resultados: boolean[] = [];

    // Umbrales para curl de bíceps 
    private static readonly UMBRALES = {
        down: 160,
        up: 45,
        swingLimit: 30
    };
    private static readonly BUFFER_SIZE = 5;

    private static readonly FEEDBACK_CFG = [
        {
            minPct: 100,
            titles: [
                '¡Curl de campeón!',
                'Bíceps de acero 💪',
                'Máxima precisión'
            ],
            tips: [
                'Mantené el codo clavado al costado todo el tiempo.',
                'Exhalá al flexionar e inhalá al extender.',
                'Controlá el movimiento, nada de impulso.',
                'Sentí la contracción arriba del bíceps.'
            ]
        },
        {
            minPct: 90,
            titles: [
                '¡Muy buen curl!',
                'Casi perfecto',
                'Buen trabajo'
            ],
            tips: [
                'Fijate que el antebrazo suba hasta el tope sin extender el hombro.',
                'No abraces el peso con el cuerpo.',
                'Mantené la muñeca firme y en línea con el antebrazo.',
                'Bajá despacio para sentir bien el músculo.'
            ]
        },
        {
            minPct: 80,
            titles: [
                'Técnica sólida',
                '¡Vas muy bien!',
                'Bíceps trabajando'
            ],
            tips: [
                'No te apures: un segundo arriba y uno abajo.',
                'Evitá que el codo se adelante al subir.',
                'Sentí el músculo arriba antes de extender.',
                'Mantené el pecho erguido y hombros atrás.'
            ]
        },
        {
            minPct: 70,
            titles: [
                'Técnica aceptable',
                '¡Vas mejorando!',
                'Buen ritmo'
            ],
            tips: [
                'Controlá la bajada, no dejes caer el peso.',
                'No balanceés el tronco para ayudar.',
                'Mové solo el antebrazo, el hombro quieto.',
                'Asegurate de llegar al tope de flexión.'
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
                'Acortá un poco el recorrido si te cuesta el control.',
                'Sentí bien la fibra del bíceps al subir.',
                'Mantené los pies firmes y core activo.',
                'Respirá constante, no contengas el aire.'
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
                'Bajá el peso si haces trampa con el cuerpo.',
                'Enfocate en levantar solo con el bíceps.',
                'Usá un espejo para chequear la postura.',
                'No cambies la angulación de la muñeca.'
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
                'Probá con menos peso para mejorar la forma.',
                'Mové despacito y sentí el músculo.',
                'Poné el codo contra la pared si balanceás.',
                'Activa el core para mayor estabilidad.'
            ]
        },
        {
            minPct: 30,
            titles: [
                'Técnica a mejorar',
                '¡Ánimo!',
                'Enfoque en la forma'
            ],
            tips: [
                'Primero clavá el codo para que no se desplace.',
                'Flexioná hasta donde puedas sin mover hombros.',
                'Controlá bien la bajada.',
                'Usá un palo para guiar el brazo si es necesario.'
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
                'Bajá mucho el peso para sentir el recorrido.',
                'Enfocate en el patrón: solo antebrazo.',
                'Respirá profundo y soltá al subir.',
                'Practica frente al espejo cada repetición.'
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
                'Domina sin peso el movimiento.',
                'Asegurate de no balancear hombros.',
                'Poné la espalda apoyada en la pared.',
                'Sentí bien la contracción con cada curl.'
            ]
        },
        {
            minPct: 0,
            titles: [
                'Técnica a revisar',
                '¡Empezá de cero!',
                'Aprendé el patrón'
            ],
            tips: [
                'Practica con banda sin peso para guiar el movimiento.',
                'Clavá el codo al costado, sin mover hombros.',
                'Subí hasta donde puedas sin ayuda del tronco.',
                'Fortalecé core y estabilidad antes de sumar carga.'
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
            const angR = calcularAngulo(
                lm.find(p => p.name === 'right_shoulder')!,
                lm.find(p => p.name === 'right_elbow')!,
                lm.find(p => p.name === 'right_wrist')!
            );
            const angL = calcularAngulo(
                lm.find(p => p.name === 'left_shoulder')!,
                lm.find(p => p.name === 'left_elbow')!,
                lm.find(p => p.name === 'left_wrist')!
            );

            // Se calcula cuanto se aleja cada brazo en fase bajada
            const devR = Math.abs(angR - CurlBicepsHandler.UMBRALES.down);
            const devL = Math.abs(angL - CurlBicepsHandler.UMBRALES.down);

            // Si uno de los dos supera el umbral de extensión
            if (angR > CurlBicepsHandler.UMBRALES.down || angL > CurlBicepsHandler.UMBRALES.down) {
                this.brazo = devR >= devL ? 'right' : 'left';
            } else {
                // Ninguno extendido aún -> esperamos
                return { mensaje: null, color: '', repContada: false, totalReps: this.total, termino: false };
            }
        }

        const hip = lm.find(p => p.name === `${this.brazo}_hip`)!;
        const sh = lm.find(p => p.name === `${this.brazo}_shoulder`)!;
        const elb = lm.find(p => p.name === `${this.brazo}_elbow`)!;
        const wri = lm.find(p => p.name === `${this.brazo}_wrist`)!;

        const raw = calcularAngulo(sh, elb, wri);
        const ang = suavizar(this.buffer, raw, CurlBicepsHandler.BUFFER_SIZE);

        let mensaje: string | null = null;
        let color: 'green' | 'orange' | 'red' | '' = '';
        let repContada = false;

        if (this.fase === 'down' && ang <= CurlBicepsHandler.UMBRALES.up) {
            this.fase = 'up';
            this.total++;
            repContada = true;

            // chequeo de balanceo de hombro en px
            const swing = Math.abs(sh.x - hip.x);
            const esError = swing > CurlBicepsHandler.UMBRALES.swingLimit;

            mensaje = esError
                ? 'Flexión incorrecta: evitá mover el hombro'
                : '¡Curl correcto!';
            color = esError ? 'red' : 'green';
            this.resultados.push(!esError);
        }
        else if (this.fase === 'down' && ang < CurlBicepsHandler.UMBRALES.down) {
            if (ang > CurlBicepsHandler.UMBRALES.up) {
                mensaje = 'Flexioná un poco más el codo';
                color = 'orange';
            }
        }
        else if (this.fase === 'up' && ang >= CurlBicepsHandler.UMBRALES.down) {
            this.fase = 'down';
            mensaje = 'Bajá el antebrazo con control';
            color = 'orange';
        }

        const termino = this.total === 5;
        let resumenHtml: string | undefined;
        if (termino) {
            const { html } = generarResumen(
                this.resultados,
                CurlBicepsHandler.FEEDBACK_CFG,
                5
            );
            resumenHtml = html;
        }

        return { mensaje, color, repContada, totalReps: this.total, termino, resumenHtml };
    }
}
