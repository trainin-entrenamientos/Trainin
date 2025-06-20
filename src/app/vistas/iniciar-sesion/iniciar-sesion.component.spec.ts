/*import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IniciarSesionComponent } from './iniciar-sesion.component';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CompartidoModule  } from '../../compartido/compartido.module';

describe('IniciarSesionComponent', () => {
  let component: IniciarSesionComponent;
  let fixture: ComponentFixture<IniciarSesionComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    await TestBed.configureTestingModule({
      declarations: [IniciarSesionComponent],
      imports: [ReactiveFormsModule, CompartidoModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy }
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
      email: 'test@example.com',
      contrasenia: '123456'
    });

    authServiceSpy.login.and.returnValue(of({
      token: 'fake-token',
      email: 'test@example.com',
      exito: true,
      requiereActivacion: false
    }));

    component.iniciarSesion();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
    expect(toastrSpy.error).not.toHaveBeenCalled();
  });

  it('debería mostrar error si requiere activación', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      contrasenia: '123456'
    });

    authServiceSpy.login.and.returnValue(of({
      token: '',
      email: 'test@example.com',
      exito: true,
      requiereActivacion: true
    }));

    component.iniciarSesion();

    expect(toastrSpy.error).toHaveBeenCalledWith('Debes activar tu cuenta antes de iniciar sesión.');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería mostrar error si ocurre un error en el login', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      contrasenia: '123456'
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
});*/