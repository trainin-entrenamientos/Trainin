import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BotonTraininComponent } from './boton-trainin.component';

describe('BotonTraininComponent', () => {
  let component: BotonTraininComponent;
  let fixture: ComponentFixture<BotonTraininComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BotonTraininComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BotonTraininComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería mostrar el botón correctamente al crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debería mostrar el botón con la configuración por defecto', () => {
    expect(component.tipo).toBe('button');
    expect(component.clase).toBe('btn-trainin');
    expect(component.ruta).toBeNull();
    expect(component.disabled).toBeFalse();
  });

  it('Debería mostrar un botón con tipo y estilo por defecto', () => {
    const btn = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    expect(btn.getAttribute('type')).toBe('button');
    expect(btn.classList).toContain('btn-trainin');
    expect(btn.disabled).toBeFalse();
  });

  it('Debería actualizar el botón cuando cambian sus propiedades', () => {
    component.tipo = 'submit';
    component.clase = 'mi-clase';
    component.disabled = true;
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    expect(btn.getAttribute('type')).toBe('submit');
    expect(btn.classList).toContain('mi-clase');
    expect(component.disabled).toBeTrue();
  });

  it('Debería notificar cuando el usuario presiona el botón', () => {
    spyOn(component.clickBoton, 'emit');
    const btn: HTMLButtonElement = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    btn.click();
    expect(component.clickBoton.emit).toHaveBeenCalledTimes(1);
  });
});
