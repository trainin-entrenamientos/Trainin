import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearPlanModalComponent } from './crear-plan-modal.component';
import { By } from '@angular/platform-browser';

describe('Modal de creación de plan', () => {
  let escenario: ComponentFixture<CrearPlanModalComponent>;
  let modal: CrearPlanModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearPlanModalComponent]
    }).compileComponents();

    escenario = TestBed.createComponent(CrearPlanModalComponent);
    modal = escenario.componentInstance;
    escenario.detectChanges();
  });

  it('Debería crearse el modal', () => {
    expect(modal).toBeTruthy();
  });

  it('Debería tener el evento para cerrar', () => {
    expect(modal.cerrar).toBeDefined();
    expect(typeof modal.cerrar.emit).toBe('function');
  });

  it('Debería emitirse el evento de cierre al llamar al método', () => {
    spyOn(modal.cerrar, 'emit');
    modal.cerrarModal();
    expect(modal.cerrar.emit).toHaveBeenCalledTimes(1);
  });

  it('Debería cerrarse el modal al hacer clic en el botón cerrar', () => {
    spyOn(modal, 'cerrarModal');
    const boton = escenario.debugElement.query(By.css('button'));
    boton.triggerEventHandler('click', null);
    expect(modal.cerrarModal).toHaveBeenCalled();
  });
});
