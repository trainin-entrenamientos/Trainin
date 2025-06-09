import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalPlanCreadoComponent } from './modal-plan-creado.component';
import { CompartidoModule } from '../../../compartido.module';

describe('ModalPlanCreadoComponent', () => {
  let component: ModalPlanCreadoComponent;
  let fixture: ComponentFixture<ModalPlanCreadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalPlanCreadoComponent],
      imports: [CompartidoModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPlanCreadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir el evento aceptar al llamar onAceptar()', () => {
    spyOn(component.aceptar, 'emit');

    component.onAceptar();

    expect(component.aceptar.emit).toHaveBeenCalled();
  });
});
