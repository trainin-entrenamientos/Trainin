import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalReintentoCorreccionComponent } from './modal-reintento-correccion.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ModalReintentoCorreccionComponent', () => {
  let component: ModalReintentoCorreccionComponent;
  let fixture: ComponentFixture<ModalReintentoCorreccionComponent>;
  let mockActiveModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    mockActiveModal = jasmine.createSpyObj('NgbActiveModal', ['close']);

    await TestBed.configureTestingModule({
      imports: [ModalReintentoCorreccionComponent],
      providers: [{ provide: NgbActiveModal, useValue: mockActiveModal }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReintentoCorreccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cerrar el modal con "continuar" al llamar continuar()', () => {
    component.continuar();
    expect(mockActiveModal.close).toHaveBeenCalledWith('continuar');
  });
});
