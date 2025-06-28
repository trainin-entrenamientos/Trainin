import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let mockAuthService: any;
  let mockRouter: any;
  let mockToastr: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['registrarUsuario']);
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockToastr = jasmine.createSpyObj(['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegistroComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: mockToastr },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar los campos como tocados si el formulario es inválido', () => {
    const marcarSpy = spyOn(component, 'marcarCamposComoTocados').and.callThrough();

    component.onSubmit();

    expect(marcarSpy).toHaveBeenCalled();
    expect(mockToastr.error).toHaveBeenCalledWith(
      'Por favor, completá todos los campos correctamente.'
    );
  });

  it('debería marcar error si las contraseñas no coinciden', () => {
    component.registroForm.patchValue({
     nombre: 'Facundo',
    apellido: 'Varela',
    email: 'facu@gmail.comm',
    contrasenia: 'Abc123!',
    repetirContrasenia: 'Abc124!',
    fechaNacimiento: '2000-01-10',
    aceptarTerminos: true
    });

    expect(component.registroForm.valid).toBeFalse();
  expect(component.registroForm.errors?.['contrasenasNoCoinciden']).toBeTrue();
  });

  it('debería invalidar edad si es menor de 16 años', () => {
    const fechaInvalida = new Date();
    fechaInvalida.setFullYear(fechaInvalida.getFullYear() - 10);

    component.registroForm.get('fechaNacimiento')?.setValue(fechaInvalida.toISOString());

    const control = component.registroForm.get('fechaNacimiento');
  expect(control?.errors?.['edadMinima']).toBeTrue();
  });

  it('debería registrar correctamente cuando el formulario es válido', fakeAsync(() => {
    const mockResponse = {
      mensaje: '¡Bienvenido!',
      objeto: {},
      exito: true
    };

    mockAuthService.registrarUsuario.and.returnValue(of(mockResponse));

    component.registroForm.setValue({
    nombre: 'Facundo',
    apellido: 'Varela',
    email: 'facu@gmail.comm',
    contrasenia: 'Abc123!',
    repetirContrasenia: 'Abc123!',
    fechaNacimiento: '2000-01-10',
    aceptarTerminos: true
    });

    component.onSubmit();
    tick();

    expect(component.cargando).toBeFalse();
    expect(mockToastr.success).toHaveBeenCalledWith(
      '¡Bienvenido!',
      'Se ha registrado con éxito. Activá tu cuenta en tu Correo Electrónico para Ingresar al sitio.'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/iniciar-sesion']);
  }));

  it('debería manejar error si el registro falla', fakeAsync(() => {
    const mockError = {
      error: { mensaje: 'El correo ya está registrado.' }
    };

    mockAuthService.registrarUsuario.and.returnValue(throwError(() => mockError));

    component.registroForm.setValue({
     nombre: 'Facundo',
    apellido: 'Varela',
    email: 'facu@gmail.comm',
    contrasenia: 'Abc123!',
    repetirContrasenia: 'Abc123!',
    fechaNacimiento: '2000-01-10',
    aceptarTerminos: true
    });

    component.onSubmit();
    tick();

    expect(component.cargando).toBeFalse();
    expect(mockToastr.error).toHaveBeenCalledWith('El correo ya está registrado.');
  }));

  it('debería formatear la fecha correctamente', () => {
    const fecha = '2000-01-01';
    const resultado = component['formatearFecha'](fecha);
    expect(resultado).toContain('2000-01-01T');
  });

  it('debería marcar todos los campos como tocados', () => {
    const controls = component.registroForm.controls;
    Object.values(controls).forEach(control => {
      spyOn(control, 'markAsTouched');
    });

    component.marcarCamposComoTocados();

    Object.values(controls).forEach(control => {
      expect(control.markAsTouched).toHaveBeenCalled();
    });
  });

  it('debería devolver true si el formulario es válido', () => {
    component.registroForm.setValue({
     nombre: 'Facundo',
    apellido: 'Varela',
    email: 'facu@gmail.comm',
    contrasenia: 'Abc123!',
    repetirContrasenia: 'Abc123!',
    fechaNacimiento: '2000-01-10',
    aceptarTerminos: true
    });

    expect(component.esFormularioValido()).toBeTrue();
  });

  it('debería invalidar el formulario si no se aceptan los términos', () => {
  component.registroForm.setValue({
    nombre: 'Facundo',
    apellido: 'Varela',
    email: 'facu@gmail.comm',
    contrasenia: 'Abc123!',
    repetirContrasenia: 'Abc123!',
    fechaNacimiento: '2000-01-10',
    aceptarTerminos: false
  });

  expect(component.registroForm.valid).toBeFalse();
  expect(component.registroForm.get('aceptarTerminos')?.errors).toBeTruthy();
});

it('validarEdadMinima debería devolver null si la fecha no es válida', () => {
  const validator = component.validarEdadMinima(16);
  const result = validator({ value: 'no-es-fecha' });
  expect(result).toBeNull();
});

it('debería mostrar mensaje por defecto si el error no tiene mensaje', fakeAsync(() => {
  const mockError = {
    error: {}
  };

  mockAuthService.registrarUsuario.and.returnValue(throwError(() => mockError));

  component.registroForm.setValue({
    nombre: 'Facundo',
    apellido: 'Varela',
    email: 'facu@gmail.comm',
    contrasenia: 'Abc123!',
    repetirContrasenia: 'Abc123!',
    fechaNacimiento: '2000-01-10',
    aceptarTerminos: true
  });

  component.onSubmit();
  tick();

  expect(component.cargando).toBeFalse();
  expect(mockToastr.error).toHaveBeenCalledWith('Ocurrió un error inesperado al registrar el usuario.');
}));

});
