import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NosotrosComponent } from './nosotros.component';
import { By } from '@angular/platform-browser';

describe('NosotrosComponent', () => {
  let component: NosotrosComponent;
  let fixture: ComponentFixture<NosotrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NosotrosComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NosotrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el título "Nosotros"', () => {
    const h1Element = fixture.debugElement.query(By.css('h1'));
    expect(h1Element.nativeElement.textContent).toContain('Nosotros');
  });

  it('debería mostrar el subtítulo "TRAININ"', () => {
    const spanElement = fixture.debugElement.query(By.css('span'));
    expect(spanElement.nativeElement.textContent).toContain('TRAININ');
  });

  it('debería mostrar el texto de la misión', () => {
    const missionText = fixture.debugElement.query(By.css('.contenedor-mision p'));
    expect(missionText.nativeElement.textContent).toContain('Brindar una experiencia de entrenamiento flexible');
  });

  it('debería mostrar el texto de la visión', () => {
    const visionText = fixture.debugElement.query(By.css('.contenedor-vision p'));
    expect(visionText.nativeElement.textContent).toContain('Ser la plataforma de entrenamiento online líder');
  });

  it('debería mostrar al menos una imagen en la sección de beneficios', () => {
    const imageElements = fixture.debugElement.queryAll(By.css('img.benefit-img'));
    expect(imageElements.length).toBeGreaterThan(0);
  });

  it('debería mostrar al menos un título de beneficio', () => {
    const titleElements = fixture.debugElement.queryAll(By.css('.benefit-title'));
    expect(titleElements.length).toBeGreaterThan(0);
  });
});
