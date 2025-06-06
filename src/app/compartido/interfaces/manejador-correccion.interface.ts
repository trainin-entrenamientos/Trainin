import type { Keypoint } from '@tensorflow-models/pose-detection';
import { ResultadoCorreccion } from './resultado-correccion.interface';

export interface ManejadorCorreccion {

  readonly nombreEjercicio: string;
  readonly videoUrl: string;

  reset(): void;

  manejarTecnica(keypoints: Keypoint[]): ResultadoCorreccion;
}