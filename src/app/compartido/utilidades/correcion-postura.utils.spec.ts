import { BloqueFeedback } from '../interfaces/bloque-feedback.interface';
import { calcularAngulo, suavizar, generarResumen, stripHtml, formatearNombreEjercicio } from './correccion-postura.utils';
import type { Keypoint } from '@tensorflow-models/pose-detection';

describe('correccion-postura.utils', () => {
  describe('calcularAngulo', () => {
    it('debería calcular 90° para puntos formando un ángulo recto', () => {
      const a = { x: 0, y: 1 } as Keypoint;
      const b = { x: 0, y: 0 } as Keypoint;
      const c = { x: 1, y: 0 } as Keypoint;
      const ang = calcularAngulo(a, b, c);
      expect(ang).toBeCloseTo(90, 5);
    });

    it('debería calcular 180° para puntos en línea', () => {
      const a = { x: -1, y: 0 } as Keypoint;
      const b = { x: 0, y: 0 } as Keypoint;
      const c = { x: 1, y: 0 } as Keypoint;
      const ang = calcularAngulo(a, b, c);
      expect(ang).toBeCloseTo(180, 5);
    });
  });

  describe('suavizar', () => {
    let buffer: number[];

    beforeEach(() => {
      buffer = [];
    });

    it('debería promediar valores mientras no exceda bufferSize', () => {
      expect(suavizar(buffer, 10, 3)).toBe(10);
      expect(suavizar(buffer, 20, 3)).toBe((10 + 20) / 2);
      expect(suavizar(buffer, 30, 3)).toBe((10 + 20 + 30) / 3);
    });

    it('debería descartar el valor más antiguo cuando excede bufferSize', () => {
      suavizar(buffer, 1, 2);
      suavizar(buffer, 3, 2);
      expect(suavizar(buffer, 5, 2)).toBe((3 + 5) / 2);
    });
  });

  describe('generarResumen', () => {
    const feedbackConfig: BloqueFeedback[] = [
      { minPct: 0, titles: ['Mal'], tips: ['Tip1', 'Tip2'] },
      { minPct: 50, titles: ['Regular'], tips: ['Tip3'] },
      { minPct: 80, titles: ['Excelente'], tips: ['Tip4'] }
    ];

    it('debería devolver color-red cuando pct < 30', () => {
      spyOn(Math, 'random').and.returnValue(0);
      const res = generarResumen([false, true], feedbackConfig, 5);
      expect(res.color).toBe('color-red');
      expect(res.html).toContain('Resultado: 20% (1/5)');
      expect(res.html).toContain('Mal');
      expect(res.html).toContain('<div class="tip">Tip1</div>');
      expect(res.html).toContain('<div class="tip">Tip2</div>');
    });

    it('debería devolver color-orange cuando 30 < pct < 70', () => {
      spyOn(Math, 'random').and.returnValue(0);
      const res = generarResumen([true, true, false], feedbackConfig, 4);
      expect(res.color).toBe('color-orange');
      expect(res.html).toContain('Resultado: 50% (2/4)');
      expect(res.html).toContain('Regular');
      expect(res.html).toContain('<div class="tip">Tip3</div>');
    });

    it('debería devolver color-green y usar bloque "Excelente" cuando pct >= 80', () => {
      spyOn(Math, 'random').and.returnValue(0);
      const res = generarResumen([true, true, true, true, false], feedbackConfig, 5);
      expect(res.color).toBe('color-green');
      expect(res.html).toContain('Resultado: 80% (4/5)');
      expect(res.html).toContain('Excelente');
      expect(res.html).toContain('<div class="tip">Tip4</div>');
    });

    it('si ningún bloque matchea usa el último bloque', () => {
      spyOn(Math, 'random').and.returnValue(0);
      const customConfig: BloqueFeedback[] = [
        { minPct: 90,  titles: ['Top'],   tips: ['TipA'] },
        { minPct: 95,  titles: ['Ultra'], tips: ['TipB'] }
      ];
      const res = generarResumen([], customConfig, 3);
      expect(res.color).toBe('color-red');
      expect(res.html).toContain('Top');
      expect(res.html).toContain('<div class="tip">TipA</div>');
    });
  });

  describe('stripHtml', () => {
    it('debería eliminar etiquetas HTML y devolver solo texto', () => {
      const html = '<p>Hola <strong>mundo</strong>!</p>';
      expect(stripHtml(html)).toBe('Hola mundo!');
    });

    it('debería retornar cadena vacía si no hay texto', () => {
      expect(stripHtml('<div><br/></div>')).toBe('');
    });
  });

  describe('formatearNombreEjercicio', () => {
    it('debería convertir snake_case a Title Case', () => {
      expect(formatearNombreEjercicio('press_militar')).toBe('Press Militar');
      expect(formatearNombreEjercicio('vuelos_laterales')).toBe('Vuelos Laterales');
    });

    it('debería soportar cadenas sin guiones bajos', () => {
      expect(formatearNombreEjercicio('sentadilla')).toBe('Sentadilla');
    });

    it('debería manejar mayúsculas y minúsculas mixtas', () => {
      expect(formatearNombreEjercicio('EnCroix_LeVant')).toBe('Encroix Levant');
    });
  });
});
