import { PreguntasFrecuentesComponent } from './preguntas-frecuentes.component';

describe('PreguntasFrecuentesComponent', () => {
  let component: PreguntasFrecuentesComponent;
  let infoElems: HTMLElement[];
  let pregElems: HTMLElement[];

  beforeEach(() => {
    component = new PreguntasFrecuentesComponent();

    document.body.innerHTML = '';

    infoElems = [];
    pregElems = [];
    for (let i = 0; i < 3; i++) {
      const info = document.createElement('div');
      info.classList.add('informacion');
      document.body.appendChild(info);
      infoElems.push(info);

      const preg = document.createElement('div');
      preg.classList.add('pregunta');
      document.body.appendChild(preg);
      pregElems.push(preg);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('toggle agrega la clase active en el índice indicado', () => {
    const idx = 1;
    expect(infoElems[idx].classList).not.toContain('active');
    expect(pregElems[idx].classList).not.toContain('active');

    component.desplegarInformacion(idx);

    expect(infoElems[idx].classList).toContain('active');
    expect(pregElems[idx].classList).toContain('active');

    expect(infoElems[0].classList).not.toContain('active');
    expect(pregElems[0].classList).not.toContain('active');
    expect(infoElems[2].classList).not.toContain('active');
    expect(pregElems[2].classList).not.toContain('active');
  });

  it('toggle quita la clase active al volver a invocar en el mismo índice', () => {
    const idx = 2;
    component.desplegarInformacion(idx);
    expect(infoElems[idx].classList).toContain('active');
    expect(pregElems[idx].classList).toContain('active');

    component.desplegarInformacion(idx);
    expect(infoElems[idx].classList).not.toContain('active');
    expect(pregElems[idx].classList).not.toContain('active');
  });

  it('no lanza error si el índice está fuera de rango', () => {
    expect(() => component.desplegarInformacion(-1)).not.toThrow();
    expect(() => component.desplegarInformacion(99)).not.toThrow();
  });
});