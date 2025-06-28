import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalPlanCreadoComponent } from './modal-plan-creado.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ModalPlanCreadoComponent', () => {
  let component: ModalPlanCreadoComponent;
  let fixture: ComponentFixture<ModalPlanCreadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPlanCreadoComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPlanCreadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe ser creado', () => {
    expect(component).toBeTruthy();
  });

  describe('onAccion', () => {
    it('debe emitir "detalle" cuando se selecciona la acción "detalle"', () => {
      spyOn(component.accionSeleccionada, 'emit');

      component.onAccion('detalle');

      expect(component.accionSeleccionada.emit).toHaveBeenCalledWith('detalle');
    });

    it('debe emitir "iniciar" cuando se selecciona la acción "iniciar"', () => {
      spyOn(component.accionSeleccionada, 'emit');

      component.onAccion('iniciar');

      expect(component.accionSeleccionada.emit).toHaveBeenCalledWith('iniciar');
    });
  });
});