import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TerminosCondicionesComponent } from './terminos-condiciones.component';
import { By } from '@angular/platform-browser';

describe('TerminosCondicionesComponent', () => {
  let component: TerminosCondicionesComponent;
  let fixture: ComponentFixture<TerminosCondicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerminosCondicionesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TerminosCondicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el título principal "Términos y Condiciones"', () => {
    const h1 = fixture.debugElement.query(By.css('h1'));
    expect(h1).toBeTruthy();
    expect(h1.nativeElement.textContent).toContain('Términos y Condiciones');
  });

  it('debería mostrar al menos una sección con título y párrafo', () => {
    const h2s = fixture.debugElement.queryAll(By.css('h2'));
    expect(h2s.length).toBeGreaterThan(0);

    const primerTitulo = h2s[0].nativeElement.textContent;
    expect(primerTitulo).toContain('1. Aceptación de los Términos y Condiciones');

    const parrafo = h2s[0].nativeElement.nextElementSibling;
    expect(parrafo).toBeTruthy();
    expect(parrafo.textContent).toContain('Al acceder y utilizar TRAININ');
  });

  it('debería contener el mensaje final de agradecimiento', () => {
    const h3 = fixture.debugElement.query(By.css('h3'));
    expect(h3).toBeTruthy();
    expect(h3.nativeElement.textContent).toContain('¡Gracias por elegir TRAININ!');
  });

  it('debería contener 15 secciones numeradas con títulos', () => {
    const h2s = fixture.debugElement.queryAll(By.css('h2'));
    expect(h2s.length).toBe(15);
  });

  it('debería mostrar el texto sobre requisito de edad', () => {
    expect(fixture.nativeElement.textContent).toContain('TRAININ está dirigido a personas mayores de 16 años');
  });
});