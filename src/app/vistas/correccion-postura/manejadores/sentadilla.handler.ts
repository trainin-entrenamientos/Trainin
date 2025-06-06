import type { Keypoint } from '@tensorflow-models/pose-detection';
import { ManejadorCorreccion } from '../../../compartido/interfaces/manejador-correccion.interface';
import { NombreEjercicio } from '../../../compartido/enums/nombre-ejercicio.enum';
import { ResultadoCorreccion } from '../../../compartido/interfaces/resultado-correccion.interface';
import { calcularAngulo, generarResumen, suavizar } from '../../../compartido/utilidades/correccion-postura.utils';

export class SentadillaHandler implements ManejadorCorreccion {
    readonly nombreEjercicio = NombreEjercicio.SENTADILLA;
    readonly videoUrl = 'https://www.youtube.com/embed/XYZsentadillaPerfil?autoplay=1';

    private fase: 'down' | 'up' = 'up';
    private lado: 'right' | 'left' | null = null;
    private buffer: number[] = [];
    private total = 0;
    private resultados: boolean[] = [];

    // Umbrales para sentadilla de perfil
    private static readonly UMBRALES = {
        kneeDown: 70,
        kneeUp: 160,
        leanLimit: 15
    };
    private static readonly BUFFER_SIZE = 5;

    private static readonly FEEDBACK_CFG = [
        {
            minPct: 100,
            titles: [
                '¡Sentadilla de campeón!',
                'Formón impecable',
                'Tu squat es top'
            ],
            tips: [
                'Mantené los talones bien apoyados.',
                'Bajá hasta paralelo, sin rodillas hacia adentro.',
                'Pecho arriba y mirada al frente.',
                'Activá el abdomen en todo el recorrido.'
            ]
        },
        {
            minPct: 90,
            titles: [
                'Muy buena sentadilla',
                '¡Buen trabajo!',
                'Casi perfecto'
            ],
            tips: [
                'Empujá las rodillas hacia afuera al subir y bajar.',
                'Controlá la bajada, no dejes caer el cuerpo.',
                'Respirá: exhalá al subir, inhalá al bajar.',
                'Sentí la contracción del glúteo al final.'
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
                'Mantené la espalda neutra, sin redondear.',
                'No te levantes con los gemelos: empujá con los talones.',
                'Llegá al menos hasta paralelo al piso.',
                'Activá el core antes de iniciar cada repetición.'
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
                'Bajá un poco más para ganar profundidad.',
                'No balanceés el tronco hacia adelante.',
                'Fijate que las rodillas sigan la línea de los pies.',
                'Controlá la bajada con el abdomen activado.'
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
                'Practicá primero sin peso para trabajar forma.',
                'Conservá el pecho erguido durante toda la sentadilla.',
                'Mantén los pies a la altura de los hombros.',
                'Empujá con fuerza desde los talones.'
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
                'Bajá solo hasta donde mantengas la espalda neutra.',
                'Evita que las rodillas se vayan hacia adentro.',
                'Sentí la presión en glúteos y cuádriceps.',
                'Usá un espejo o grábate para chequear postura.'
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
                'Reduce el peso y enfocate en la forma.',
                'Sostené el abdomen para no inclinarte hacia adelante.',
                'Empuja las rodillas hacia afuera al bajar.',
                'Mantén los talones siempre en el piso.'
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
                'Practicá sentadillas con una silla detrás para guiarte.',
                'Clavá el pecho alto y la mirada al frente.',
                'Controlá la bajada: 3 segundos hacia abajo.',
                'Usá un palo a lo largo de la espalda para alinear torso.'
            ]
        },
        {
            minPct: 20,
            titles: [
                'Técnica débil',
                '¡Atención en la forma!',
                'Volvé a lo básico'
            ],
            tips: [
                'Haz sentadillas asistidas sujetándote de algo.',
                'Practica solo con tu peso antes de agregar carga.',
                'Activa el abdomen y el glúteo antes de bajar.',
                'No dejes que las rodillas se adelanten demasiado.'
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
                'Aprende el patrón con media sentadilla.',
                'Concéntrate en empujar caderas hacia atrás.',
                'Mantén la espalda recta, sin curvar.',
                'Reforzá glúteos y abdomen con ejercicios de estabilización.'
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
                'Practica el patrón con banda elástica sin peso.',
                'Sujétate de algo para no perder el equilibrio.',
                'Baja solo hasta donde mantengas buena postura.',
                'Fortalecé tu abdomen y flexibilidad antes de profundizar.'
            ]
        }
    ];


    reset(): void {
        this.fase = 'up';
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
            const angR = calcularAngulo(
                lm.find(p => p.name === 'right_hip')!,
                lm.find(p => p.name === 'right_knee')!,
                lm.find(p => p.name === 'right_ankle')!
            );
            const angL = calcularAngulo(
                lm.find(p => p.name === 'left_hip')!,
                lm.find(p => p.name === 'left_knee')!,
                lm.find(p => p.name === 'left_ankle')!
            );
            if (angR < SentadillaHandler.UMBRALES.kneeUp || angL < SentadillaHandler.UMBRALES.kneeUp) {
                this.lado = angR < angL ? 'right' : 'left';
            } else {
                return { mensaje: null, color: '', repContada: false, totalReps: this.total, termino: false };
            }
        }

        const hip = lm.find(p => p.name === `${this.lado}_hip`)!;
        const knee = lm.find(p => p.name === `${this.lado}_knee`)!;
        const ank = lm.find(p => p.name === `${this.lado}_ankle`)!;
        const sh = lm.find(p => p.name === `${this.lado}_shoulder`)!;

        // Ángulo de rodilla y suavizado
        const rawKnee = calcularAngulo(hip, knee, ank);
        const angKnee = suavizar(this.buffer, rawKnee, SentadillaHandler.BUFFER_SIZE);

        let mensaje: string | null = null;
        let color: 'green' | 'orange' | 'red' | '' = '';
        let repContada = false;

        if (this.fase === 'up' && angKnee <= SentadillaHandler.UMBRALES.kneeDown) {
            this.fase = 'down';
            mensaje = 'Descenso completo';
            color = 'orange';
        }
        else if (this.fase === 'down' && angKnee >= SentadillaHandler.UMBRALES.kneeUp) {
            this.fase = 'up';
            this.total++;
            repContada = true;

            // chequeo de inclinación de torso: ≈ 180 grados
            const rawTorso = calcularAngulo(sh, hip, knee);
            const lean = Math.abs(rawTorso - 180);
            const esError = lean > SentadillaHandler.UMBRALES.leanLimit;

            mensaje = esError
                ? 'Levantate sin inclinar demasiado el torso'
                : '¡Sentadilla correcta!';
            color = esError ? 'red' : 'green';
            this.resultados.push(!esError);
        }
        else if (this.fase === 'up' && angKnee < SentadillaHandler.UMBRALES.kneeUp) {
            mensaje = 'Empezá a bajar un poco más';
            color = 'orange';
        }

        // Si se hicieron 5 repeticiones, generar resumen
        const termino = this.total === 5;
        let resumenHtml: string | undefined;
        if (termino) {
            const { html } = generarResumen(
                this.resultados,
                SentadillaHandler.FEEDBACK_CFG,
                5
            );
            resumenHtml = html;
        }

        return { mensaje, color, repContada, totalReps: this.total, termino, resumenHtml };
    }
}
