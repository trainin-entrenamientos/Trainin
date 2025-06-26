import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearPlanModalComponent } from './crear-plan-modal.component';

describe('CrearPlanModalComponent', () => {
  let component: CrearPlanModalComponent;
  let fixture: ComponentFixture<CrearPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearPlanModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir el evento "cerrar" al llamar cerrarModal()', () => {
    spyOn(component.cerrar, 'emit');

    component.cerrarModal();

    expect(component.cerrar.emit).toHaveBeenCalled();
  });
});
