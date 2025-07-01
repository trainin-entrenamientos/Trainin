import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoliticasPrivacidadComponent } from './politicas-privacidad.component';
import { By } from '@angular/platform-browser';

describe('PoliticasPrivacidadComponent', () => {
  let component: PoliticasPrivacidadComponent;
  let fixture: ComponentFixture<PoliticasPrivacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoliticasPrivacidadComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticasPrivacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el título "Políticas de privacidad"', () => {
    const h1Element = fixture.debugElement.query(By.css('h1'));
    expect(h1Element.nativeElement.textContent).toContain('Políticas de privacidad');
  });

  it('debería mostrar la sección "1. Información que recopilamos"', () => {
    const h2Element = fixture.debugElement.query(By.css('h2'));
    expect(h2Element.nativeElement.textContent).toContain('1. Información que recopilamos');
  });

  it('debería mostrar el texto de la política de privacidad', () => {
    const policyText = fixture.debugElement.query(By.css('p'));
    expect(policyText.nativeElement.textContent).toContain(
      'En TRAININ, nos comprometemos a proteger tu privacidad'
    );
  });

  it('debería mostrar la imagen del logo de TRAININ', () => {
    const imgElement = fixture.debugElement.query(By.css('img.logo-trainin'));
    expect(imgElement.nativeElement.src).toContain('logo-trainin.svg');
  });

  it('debería mostrar al menos un encabezado h2 para las secciones', () => {
    const h2Elements = fixture.debugElement.queryAll(By.css('h2'));
    expect(h2Elements.length).toBeGreaterThan(0);
  });

  it('debería mostrar correctamente los puntos de la lista en la sección "5. Compartir información"', () => {
    const listItems = fixture.debugElement.queryAll(By.css('ul li'));
    expect(listItems.length).toBeGreaterThan(0);
    expect(listItems[0].nativeElement.textContent).toContain('Si la ley lo exige o ante requerimientos legales válidos');
  });
});