import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalCambiarContraseniaComponent } from './modal-cambiar-contrasenia.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PerfilService } from '../../../../core/servicios/perfilServicio/perfil.service';
import { of, throwError } from 'rxjs';
import { CambiarContraseniaDTO } from '../../../../core/modelos/CambiarContraseniaDTO';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RespuestaApi } from '../../../../core/modelos/RespuestaApiDTO';

describe('ModalCambiarContraseniaComponent', () => {
  let component: ModalCambiarContraseniaComponent;
  let fixture: ComponentFixture<ModalCambiarContraseniaComponent>;
  let perfilServiceMock: jasmine.SpyObj<PerfilService>;
  let toastrServiceMock: jasmine.SpyObj<ToastrService>;
  let activeModalMock: jasmine.SpyObj<NgbActiveModal>;

  const mockResponse: RespuestaApi<string> = {
    exito: true,
    mensaje: 'Contraseña cambiada con éxito',
    objeto: 'success',  // Corrected with 'objeto'
  };

  const errorResponse: RespuestaApi<string> = {
    exito: false,
    mensaje: 'Error al cambiar la contraseña',
    objeto: 'error',  // Corrected with 'objeto'
  };

  beforeEach(() => {
    perfilServiceMock = jasmine.createSpyObj('PerfilService', ['cambiarContrasenia']);
    toastrServiceMock = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    activeModalMock = jasmine.createSpyObj('NgbActiveModal', ['dismiss', 'close']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ModalCambiarContraseniaComponent],
      providers: [
        { provide: PerfilService, useValue: perfilServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: NgbActiveModal, useValue: activeModalMock },
        FormBuilder,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Allow custom elements in tests
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCambiarContraseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe ser creado', () => {
    expect(component).toBeTruthy();
  });

  describe('validaciones del formulario', () => {
    it('debe ser inválido si las contraseñas no coinciden', () => {
      component.form.controls['nuevaContrasenia'].setValue('password123');
      component.form.controls['confirmarNuevaContrasenia'].setValue('password456');
      expect(component.form.invalid).toBeTrue();
    });

     it('debe ser válido si las contraseñas coinciden', () => {
      component.form.controls['contraseniaActual'].setValue('oldpassword');
      component.form.controls['nuevaContrasenia'].setValue('password123');
      component.form.controls['confirmarNuevaContrasenia'].setValue('password123');
      expect(component.form.valid).toBeTrue();
  });

    it('debe ser inválido si no se ingresa la contraseña actual', () => {
      component.form.controls['contraseniaActual'].setValue('');
      expect(component.form.controls['contraseniaActual'].invalid).toBeTrue();
    });
  });

  describe('guardar', () => {
    it('debe llamar a perfilService.cambiarContrasenia y cerrar el modal si la respuesta es exitosa', () => {
      perfilServiceMock.cambiarContrasenia.and.returnValue(of(mockResponse));

      component.form.controls['contraseniaActual'].setValue('oldpassword');
      component.form.controls['nuevaContrasenia'].setValue('newpassword123');
      component.form.controls['confirmarNuevaContrasenia'].setValue('newpassword123');

      component.guardar();

      expect(perfilServiceMock.cambiarContrasenia).toHaveBeenCalled();
      expect(toastrServiceMock.success).toHaveBeenCalledWith(mockResponse.mensaje);
      expect(activeModalMock.close).toHaveBeenCalled();
    });

    it('debe mostrar error y no cerrar el modal si la respuesta falla', () => {
      perfilServiceMock.cambiarContrasenia.and.returnValue(of(errorResponse));

      component.form.controls['contraseniaActual'].setValue('oldpassword');
      component.form.controls['nuevaContrasenia'].setValue('newpassword123');
      component.form.controls['confirmarNuevaContrasenia'].setValue('newpassword123');

      component.guardar();

      expect(toastrServiceMock.error).toHaveBeenCalledWith(errorResponse.mensaje);
      expect(activeModalMock.close).not.toHaveBeenCalled();
    });

    it('debe manejar error en la llamada a la API', () => {
      perfilServiceMock.cambiarContrasenia.and.returnValue(throwError('API error'));

      component.form.controls['contraseniaActual'].setValue('oldpassword');
      component.form.controls['nuevaContrasenia'].setValue('newpassword123');
      component.form.controls['confirmarNuevaContrasenia'].setValue('newpassword123');

      component.guardar();

      expect(toastrServiceMock.error).toHaveBeenCalledWith('Error al cambiar la contraseña');
    });
  });

  describe('cancelar', () => {
    it('debe cerrar el modal cuando se llama a cancelar', () => {
      component.cancelar();
      expect(activeModalMock.dismiss).toHaveBeenCalled();
    });
  });
});
