import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEliminarEjercicioComponent } from './modal-eliminar-ejercicio.component';

declare global {
  interface Window {
    bootstrap: any;
  }
}

describe('ModalEliminarEjercicioComponent', () => {
  let component: ModalEliminarEjercicioComponent;
  let fixture: ComponentFixture<ModalEliminarEjercicioComponent>;
  let mockModalInstance: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEliminarEjercicioComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    mockModalInstance = { hide: jasmine.createSpy('hide') };
    (window as any).bootstrap = {
      Modal: {
        getInstance: jasmine.createSpy().and.returnValue(mockModalInstance),
      },
    };

    fixture = TestBed.createComponent(ModalEliminarEjercicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir confirmarEliminar al llamar confirmarEliminacion()', () => {
    spyOn(component.confirmarEliminar, 'emit');

    const modalElement = fixture.nativeElement.querySelector('#bootstrapModal');

    component.confirmarEliminacion();

    expect(component.confirmarEliminar.emit).toHaveBeenCalled();
    expect((window as any).bootstrap.Modal.getInstance).toHaveBeenCalledWith(
      modalElement
    );
    expect(mockModalInstance.hide).toHaveBeenCalled();
  });
});
