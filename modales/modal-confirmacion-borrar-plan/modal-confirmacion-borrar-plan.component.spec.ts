import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalConfirmacionBorrarPlanComponent } from './modal-confirmacion-borrar-plan.component';

describe('ModalConfirmacionBorrarPlanComponent', () => {
  let component: ModalConfirmacionBorrarPlanComponent;
  let fixture: ComponentFixture<ModalConfirmacionBorrarPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalConfirmacionBorrarPlanComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmacionBorrarPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir onConfirm al llamar confirmar()', () => {
    spyOn(component.onConfirm, 'emit');
    component.confirmar();
    expect(component.onConfirm.emit).toHaveBeenCalled();
  });

  it('debería emitir onCancel al llamar cancelar()', () => {
    spyOn(component.onCancel, 'emit');
    component.cancelar();
    expect(component.onCancel.emit).toHaveBeenCalled();
  });

  it('debería tener un mensaje por defecto si no se le asigna uno', () => {
    expect(component.mensaje).toBe(
      '¿Estás segur@ que querés desactivar este plan?'
    );
  });

  it('debería tener visible en false por defecto', () => {
    expect(component.visible).toBeFalse();
  });
});
