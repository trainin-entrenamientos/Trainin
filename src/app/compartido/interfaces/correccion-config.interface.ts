import type { Keypoint } from '@tensorflow-models/pose-detection';
import { NombreEjercicio } from '../enums/nombre-ejercicio.enum';


export type Fase = 'arriba' | 'abajo';

export interface CorreccionConfig {
  exercise: NombreEjercicio;
  videoUrl: string;
  evaluationReps: number;
  thresholds: { down: number; up: number }; 
  bufferSize: number;
  feedbackConfig: Array<{
    minPct: number;
    titles: string[];
    tips: string[];
  }>;
  errorDetector: (lm: Keypoint[], fase: Fase) => string | null;
}
