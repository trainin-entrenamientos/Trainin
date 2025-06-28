import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditarPerfilComponent } from './modal-editar-perfil.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfilService } from '../../../../core/servicios/perfilServicio/perfil.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { UsuarioEditado } from '../../../../core/modelos/UsuarioEditadoDTO';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const perfilServiceMock = {
  editarPerfil: jasmine.createSpy('editarPerfil')
};

const toastrServiceMock = {
  success: jasmine.createSpy('success'),
  error: jasmine.createSpy('error')
};

const activeModalMock = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);

describe('ModalEditarPerfilComponent', () => {
  let component: ModalEditarPerfilComponent;
  let fixture: ComponentFixture<ModalEditarPerfilComponent>;

  const mockUsuario: UsuarioEditado = {
    id: 1,
    nombre: 'John',
    apellido: 'Doe',
    fechaNacimiento: '1990-01-01',
    altura: 175,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ModalEditarPerfilComponent],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalMock },
        { provide: PerfilService, useValue: perfilServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarPerfilComponent);
    component = fixture.componentInstance;
    component.usuario = mockUsuario;
    fixture.detectChanges();
  });

  it('debe ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con los valores del usuario', () => {
    expect(component.form.get('nombre')?.value).toBe(mockUsuario.nombre);
    expect(component.form.get('apellido')?.value).toBe(mockUsuario.apellido);
    expect(component.form.get('fechaNacimiento')?.value).toBe(mockUsuario.fechaNacimiento);
    expect(component.form.get('altura')?.value).toBe(mockUsuario.altura);
  });

  describe('validaciones del formulario', () => {
    it('debe ser inválido si el nombre está vacío', () => {
      component.form.controls['nombre'].setValue('');
      expect(component.form.controls['nombre'].invalid).toBeTrue();
    });

    it('debe ser válido si el nombre tiene al menos 2 caracteres', () => {
      component.form.controls['nombre'].setValue('Jo');
      expect(component.form.controls['nombre'].valid).toBeTrue();
    });

    it('debe ser inválido si el apellido está vacío', () => {
      component.form.controls['apellido'].setValue('');
      expect(component.form.controls['apellido'].invalid).toBeTrue();
    });

    it('debe ser válido si el apellido tiene al menos 2 caracteres', () => {
      component.form.controls['apellido'].setValue('Doe');
      expect(component.form.controls['apellido'].valid).toBeTrue();
    });

    it('debe ser inválido si la fecha de nacimiento está vacía', () => {
      component.form.controls['fechaNacimiento'].setValue('');
      expect(component.form.controls['fechaNacimiento'].invalid).toBeTrue();
    });

    it('debe ser inválido si la altura está fuera del rango (menor a 50)', () => {
      component.form.controls['altura'].setValue(40);
      expect(component.form.controls['altura'].invalid).toBeTrue();
    });

    it('debe ser inválido si la altura está fuera del rango (mayor a 300)', () => {
      component.form.controls['altura'].setValue(350);
      expect(component.form.controls['altura'].invalid).toBeTrue();
    });

    it('debe ser válido si la altura está dentro del rango (50-300)', () => {
      component.form.controls['altura'].setValue(175);
      expect(component.form.controls['altura'].valid).toBeTrue();
    });
  });

  describe('guardar', () => {
    it('debe llamar a perfilService.editarPerfil y cerrar el modal si el formulario es válido', () => {
      component.form.controls['nombre'].setValue('John');
      component.form.controls['apellido'].setValue('Doe');
      component.form.controls['fechaNacimiento'].setValue('1990-01-01');
      component.form.controls['altura'].setValue(175);
      
      perfilServiceMock.editarPerfil.and.returnValue(of({ exito: true, mensaje: 'Perfil actualizado correctamente', objeto: '' }));

      component.guardar();

      expect(perfilServiceMock.editarPerfil).toHaveBeenCalledWith(mockUsuario);
      expect(toastrServiceMock.success).toHaveBeenCalledWith('Perfil actualizado correctamente');
    });

    it('debe mostrar error si perfilService.editarPerfil falla', () => {
      component.form.controls['nombre'].setValue('John');
      component.form.controls['apellido'].setValue('Doe');
      component.form.controls['fechaNacimiento'].setValue('1990-01-01');
      component.form.controls['altura'].setValue(175);

      perfilServiceMock.editarPerfil.and.returnValue(
        throwError(() => new Error('Error en servidor'))
      );

      component.guardar();

      expect(toastrServiceMock.error).toHaveBeenCalledWith('Error al actualizar perfil');
    });

    it('debe manejar error si la llamada a editarPerfil falla con error de red', () => {
      component.form.controls['nombre'].setValue('John');
      component.form.controls['apellido'].setValue('Doe');
      component.form.controls['fechaNacimiento'].setValue('1990-01-01');
      component.form.controls['altura'].setValue(175);

      perfilServiceMock.editarPerfil.and.returnValue(throwError('Error en la red'));

      component.guardar();

      expect(toastrServiceMock.error).toHaveBeenCalledWith('Error al actualizar perfil');
    });
  });

  describe('cancelar', () => {
    it('debe cerrar el modal cuando se llama a cancelar', () => {
      component.cancelar();
      expect(activeModalMock.dismiss).toHaveBeenCalled();
    });
  });
});
