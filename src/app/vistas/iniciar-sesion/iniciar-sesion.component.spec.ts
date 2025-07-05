import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IniciarSesionComponent } from './iniciar-sesion.component';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CompartidoModule } from '../../compartido/compartido.module';
import { NotificacionesService } from '../../core/servicios/notificacionesServicio/notificaciones.service';

describe('IniciarSesionComponent', () => {
  let component: IniciarSesionComponent;
  let fixture: ComponentFixture<IniciarSesionComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let notificacionesSpy: jasmine.SpyObj<NotificacionesService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'getRol']);
    authServiceSpy.getRol.and.returnValue('');
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);
    notificacionesSpy = jasmine.createSpyObj('NotificacionesService', ['pedirPermisoYRegistrar']);

    await TestBed.configureTestingModule({
      declarations: [IniciarSesionComponent],
      imports: [ReactiveFormsModule, CompartidoModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: NotificacionesService, useValue: notificacionesSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IniciarSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería navegar a /planes si el login es exitoso y no requiere activación', () => {
    component.loginForm.setValue({
      email: 'trainin@trainin.com',
      contrasenia: '123456c'
    });

    authServiceSpy.login.and.returnValue(of({
      objeto: {
        token: 'fake-token',
        email: 'trainin@trainin.com',
        exito: true,
        requiereActivacion: false
      }
    } as any));

    component.iniciarSesion();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
    expect(toastrSpy.error).not.toHaveBeenCalled();
  });

  it('debería mostrar error si requiere activación', () => {
    component.loginForm.setValue({
      email: 'trainin@trainin.com',
      contrasenia: '123456c'
    });

    authServiceSpy.login.and.returnValue(of({
      objeto: {
        token: '',
        email: 'trainin@trainin.com',
        exito: true,
        requiereActivacion: true
      }
    } as any));

    component.iniciarSesion();

    expect(toastrSpy.error).toHaveBeenCalledWith('Debes activar tu cuenta antes de iniciar sesión.');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería mostrar error si ocurre un error en el login', () => {
    component.loginForm.setValue({
      email: 'trainin@trainin.com',
      contrasenia: '123456c'
    });

    authServiceSpy.login.and.returnValue(throwError(() => new Error('Error de servidor')));

    component.iniciarSesion();

    expect(toastrSpy.error).toHaveBeenCalledWith('Credenciales incorrectas o error de servidor.');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('no debería hacer nada si el formulario es inválido', () => {
    component.loginForm.setValue({
      email: '',
      contrasenia: ''
    });

    component.iniciarSesion();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(toastrSpy.error).not.toHaveBeenCalled();
  });

  it('debería llamar a pedirPermisoYRegistrar y navegar a /listarEjercicios si es administrador', () => {

    component.loginForm.setValue({
      email: 'admin@trainin.com',
      contrasenia: 'admin123'
    });

    authServiceSpy.login.and.returnValue(of({
      objeto: {
        token: 'admin-token',
        email: 'admin@trainin.com',
        exito: true,
        requiereActivacion: false
      }
    } as any));

    authServiceSpy.getRol.and.returnValue('Administrador');

    component.iniciarSesion();

    expect(notificacionesSpy.pedirPermisoYRegistrar).toHaveBeenCalled();

    expect(routerSpy.navigate)
      .toHaveBeenCalledWith(['/listarEjercicios']);

    expect(toastrSpy.error).not.toHaveBeenCalled();
  });

  it('debería llamar a pedirPermisoYRegistrar en login exitoso no admin', () => {
    component.loginForm.setValue({
      email: 'ttrainin@trainin.com',
      contrasenia: '123456c'
    });
    authServiceSpy.login.and.returnValue(of({
      objeto: {
        token: 'usuario-token',
        email: 'trainin@trainin.com',
        exito: true,
        requiereActivacion: false
      }
    } as any));
    notificacionesSpy.pedirPermisoYRegistrar.calls.reset();

    component.iniciarSesion();

    expect(notificacionesSpy.pedirPermisoYRegistrar).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
  });

  it('debería resetear cargando a false si requiere activación', () => {
    component.loginForm.setValue({ email: 'trainin@trainin.com', contrasenia: '1234c' });
    authServiceSpy.login.and.returnValue(of({
      objeto: { exito: true, requiereActivacion: true, token: '', email: '' }
    } as any));

    component.iniciarSesion();

    expect(component.cargando).toBeFalse();
  });

  it('debería resetear cargando a false si hay error en el login', fakeAsync(() => {
    component.loginForm.setValue({ email: 'trainin@trainin.com', contrasenia: '1234c' });

    authServiceSpy.login.and.returnValue(throwError(() => new Error()));

    component.cargando = false;   
    component.iniciarSesion(); 
    tick();

    expect(component.cargando).toBeFalse();
  }));

  it('obtenerRolUsuario() debe poner esAdministrador = true si rol es "Administrador"', () => {
    authServiceSpy.getRol.and.returnValue('Administrador');
    component.esAdministrador = false;
    component.obtenerRolUsuario();
    expect(component.esAdministrador).toBeTrue();
  });

  it('obtenerRolUsuario() no debe cambiar esAdministrador si rol no es "Administrador"', () => {
    authServiceSpy.getRol.and.returnValue('Usuario');
    component.esAdministrador = false;
    component.obtenerRolUsuario();
    expect(component.esAdministrador).toBeFalse();
  });

});