import type { Keypoint } from '@tensorflow-models/pose-detection';
import { BloqueFeedback } from '../interfaces/bloque-feedback.interface';

export function calcularAngulo(a: Keypoint, b: Keypoint, c: Keypoint): number {
  const ab = [ a.x - b.x, a.y - b.y ];
  const cb = [ c.x - b.x, c.y - b.y ];
  const dot = ab[0] * cb[0] + ab[1] * cb[1];
  const mag = Math.hypot(...ab) * Math.hypot(...cb);
  return Math.acos(dot / mag) * (180 / Math.PI);
}

export function suavizar(buffer: number[], valor: number, bufferSize: number): number {
  buffer.push(valor);
  if (buffer.length > bufferSize) buffer.shift();
  return buffer.reduce((a, b) => a + b, 0) / buffer.length;
}

/**
* Dada la serie de aciertos/fallos y la configuración de feedback,
* genera el HTML final y el color de la tarjeta resumen.
*/
export function generarResumen(
  resultados: boolean[],
  feedbackConfig: BloqueFeedback[],
  evaluationReps: number
): { html: string; color: 'color-green' | 'color-orange' | 'color-red' } {
  const exitosas = resultados.filter(r => r).length;
  const pct = Math.round((exitosas / evaluationReps) * 100);

  const sorted = [...feedbackConfig].sort((a, b) => b.minPct - a.minPct);
  const bloque = sorted.find(f => pct >= f.minPct) || sorted[sorted.length - 1];

  const titulo = bloque.titles[Math.floor(Math.random() * bloque.titles.length)];

  const allTips = bloque.tips;

  // lógica de color: 0–30 rojo, >30–<70 naranja, >=70 verde
  let color: 'color-green' | 'color-orange' | 'color-red';
  if (pct > 30 && pct < 70) {
    color = 'color-orange';
  } else if (pct >= 70) {
    color = 'color-green';
  } else {
    color = 'color-red';
  }

  const html = `
    <div class="resumen-container">
      <strong class="resumen-titulo ${color}">${titulo}</strong>
      <div class="resultado ${color}">
        Resultado: ${pct}% (${exitosas}/${evaluationReps})
      </div>
      <div class="resumen-consejos">
        ${allTips.map(t => `<div class="tip">${t}</div>`).join('')}
      </div>
    </div>
  `;

  return { html, color };
}

export function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || '';
}

/**
 * Pasa de snake_case a “Title Case”:
 * press_militar  → Press Militar
 * vuelos_laterales → Vuelos Laterales
 */
export function formatearNombreEjercicio(clave: string): string {
  return clave
    .split('_')
    .map(palabra =>
      palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    )
    .join(' ');
}
