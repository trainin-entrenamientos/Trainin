/*import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['registrarUsuario']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [RegistroComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrSpy},
        
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería invalidar el formulario si los campos están vacíos', () => {
    component.registroForm.setValue({
      nombre: '',
      apellido: '',
      email: '',
      contrasenia: '',
      repetirContrasenia: '',
      fechaNacimiento: '',
      aceptarTerminos: false
    });

    expect(component.registroForm.invalid).toBeTrue();
  });

  it('debería mostrar error si el formulario es inválido al enviar', () => {
    component.registroForm.setValue({
      nombre: '',
      apellido: '',
      email: '',
      contrasenia: '',
      repetirContrasenia: '',
      fechaNacimiento: '',
      aceptarTerminos: false
    });

    component.onSubmit();

    expect(toastrSpy.error).toHaveBeenCalledWith(
      'Por favor, completá todos los campos correctamente.',
      'Formulario inválido'
    );
  });
  
  it('debería manejar error del servicio de registro', () => {
    const datosValidos = {
      nombre: 'Ana',
      apellido: 'López',
      email: 'ana@example.com',
      contrasenia: 'Ana@123',
      repetirContrasenia: 'Ana@123',
      fechaNacimiento: '1990-01-01',
      aceptarTerminos: true
    };

    component.registroForm.setValue(datosValidos);

    authServiceSpy.registrarUsuario.and.returnValue(
      throwError(() => ({ error: { mensaje: 'Email ya registrado' } }))
    );

    component.onSubmit();

    expect(toastrSpy.error).toHaveBeenCalledWith(
      'Por favor, completá todos los campos correctamente.',
      'Formulario inválido'
    );
  });

  it('debería marcar error si las contraseñas no coinciden', () => {
    component.registroForm.patchValue({
      contrasenia: 'Password1!',
      repetirContrasenia: 'Password2!'
    });

    const errores = component.registroForm.errors;
    expect(errores?.['contrasenasNoCoinciden']).toBeTrue();
  });

  it('debería validar que la edad mínima sea 16 años', () => {
    const fechaMenor = new Date();
    fechaMenor.setFullYear(fechaMenor.getFullYear() - 15);

    component.registroForm.patchValue({
      fechaNacimiento: fechaMenor.toISOString().split('T')[0]
    });

    const errores = component.registroForm.get('fechaNacimiento')?.errors;
    expect(errores?.['edadMinima']).toBeTrue();
  });
  
  it('debería registrar usuario exitosamente', fakeAsync(() => {
      
      const datosValidos = {
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@example.com',
      contrasenia: 'Test@123',
      repetirContrasenia: 'Test@123',
      fechaNacimiento: '2000-01-01',
      aceptarTerminos: true
      };
        
       const mockResponse = { mensaje: 'Usuario registrado exitosamente' };
  authServiceSpy.registrarUsuario.and.returnValue(of(mockResponse));
  component.registroForm.setValue(datosValidos);
  console.log(component.registroForm.valid); // Debería mostrar true
  console.log(component.registroForm.value);

  component.onSubmit();

  tick();
  expect(authServiceSpy.registrarUsuario).toHaveBeenCalled();
  expect(toastrSpy.success).toHaveBeenCalledWith(
    mockResponse.mensaje,
    'Se ha registrado con éxito. Activá tu cuenta en tu Correo Electrónico para Ingresar al sitio.'
  );
  expect(router.navigate).toHaveBeenCalledWith(['/iniciar-sesion']);
      }));
  
});*/
