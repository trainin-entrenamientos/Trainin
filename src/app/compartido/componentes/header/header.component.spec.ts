import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';
import { AuthService } from '../../../core/servicios/authServicio/auth.service';
import { HeaderComponent } from './header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToastrService, TOAST_CONFIG } from 'ngx-toastr';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let authSpy: jasmine.SpyObj<AuthService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  const eventsSubject = new Subject<any>();
  let rolSubject: Subject<string>;
  
  beforeEach(async () => {
    rolSubject = new Subject<string>();

    authSpy = jasmine.createSpyObj('AuthService', [
      'estaAutenticado',
      'cerrarSesion',
      'getRol'
    ],
      { rol$: rolSubject.asObservable() }
    );
    toastrSpy = jasmine.createSpyObj('ToastrService', ['info']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TOAST_CONFIG, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    router = TestBed.inject(Router);
    
    spyOnProperty(router, 'events', 'get').and.returnValue(eventsSubject.asObservable());

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería identificar cuando está en la página de la rutina', () => {
    eventsSubject.next(
      new NavigationEnd(1, '/informacion-ejercicio', '/informacion-ejercicio')
    );
    expect(component.enRutina).toBeTrue();
    eventsSubject.next(new NavigationEnd(2, '/home', '/home'));
    expect(component.enRutina).toBeFalse();
  });

  it('Debería devolver el enlace del logo según el estado de la sesión y la rutina', () => {
    authSpy.estaAutenticado.and.returnValue(true);
    component.enRutina = false;
    expect(component.obtenerRutaLogo()).toBe('/planes');

    component.enRutina = true;
    expect(component.obtenerRutaLogo()).toBeNull();

    authSpy.estaAutenticado.and.returnValue(false);
    component.enRutina = false;
    expect(component.obtenerRutaLogo()).toBe('/inicio');
  });

  it('Debería impedir la navegación cuando el usuario está en la rutina', () => {
    const evt = jasmine.createSpyObj('evt', ['preventDefault']);
    component.enRutina = true;
    component.navegarSiCorresponde(evt as any);
    expect(evt.preventDefault).toHaveBeenCalled();
  });

  it('No debería prevenir la navegación cuando el usuario no está realizando la rutina', () => {
    const evt = jasmine.createSpyObj('evt', ['preventDefault']);
    component.enRutina = false;
    component.navegarSiCorresponde(evt as any);
    expect(evt.preventDefault).not.toHaveBeenCalled();
  });

  it('Debería indicar si el usuario está autenticado', () => {
    authSpy.estaAutenticado.and.returnValue(true);
    expect(component.estaLogueado()).toBeTrue();

    authSpy.estaAutenticado.and.returnValue(false);
    expect(component.estaLogueado()).toBeFalse();
  });

  it('Debería cerrarse la sesión llamando a AuthService', () => {
    component.cerrarSesion();
    expect(authSpy.cerrarSesion).toHaveBeenCalled();
  });

  it('Debería navegarse a los planes al finalizar rutina', () => {
    const navSpy = spyOn(router, 'navigate');
    component.finalizarRutina();
    expect(navSpy).toHaveBeenCalledWith(['/planes']);
  });

  it('Debería mostrar y ocultar el modal de finalizar rutina correctamente', () => {
    component.abrirModalFinalizarRutina();
    expect(component.mostrarModalSalirRutina).toBeTrue();

    component.cancelarSalidaRutina();
    expect(component.mostrarModalSalirRutina).toBeFalse();
  });

  it('Debería cerrar el modal de salir de la rutina y navegar a los planes', () => {
    const navSpy = spyOn(router, 'navigate');
    component.mostrarModalSalirRutina = true;
    component.confirmarSalidaRutina();
    expect(component.mostrarModalSalirRutina).toBeFalse();
    expect(navSpy).toHaveBeenCalledWith(['/planes']);
  });

  it('Debería cerrar sesión y ocultar el menú cuando el usuario hace click en cerrar sesión', () => {
    const mockEvt = jasmine.createSpyObj('evt', ['preventDefault']);
    const dropdownEl = document.createElement('div');
    dropdownEl.id = 'userDropdown';
    spyOn(document, 'getElementById').and.returnValue(dropdownEl);

    const hideSpy = jasmine.createSpy();
    (window as any).bootstrap = {
      Dropdown: { getOrCreateInstance: () => ({ hide: hideSpy }) },
    };

    component.onClickCerrarSesion(mockEvt as any);

    expect(mockEvt.preventDefault).toHaveBeenCalled();
    expect(hideSpy).toHaveBeenCalled();
    expect(authSpy.cerrarSesion).toHaveBeenCalled();
    expect(toastrSpy.info).toHaveBeenCalledWith(
      'Has cerrado sesión correctamente.',
      '',
      { timeOut: 5000, closeButton: true, tapToDismiss: true }
    );
  });

  it('Debería reconocer todas las rutas de rutina como páginas de rutina', () => {
    [
      'informacion-ejercicio',
      'calibracion-camara',
      'correccion-postura',
      'realizar-ejercicio',
      'finalizacion-rutina',
    ].forEach((ruta, i) => {
      eventsSubject.next(new NavigationEnd(i, `/${ruta}`, `/${ruta}`));
      expect(component.enRutina).toBeTrue();
    });
  });

  it('Debería definir rol de administrador al recibir rol desde el servicio', () => {
  rolSubject.next('Administrador');
  expect(component.esAdministrador).toBeTrue();
});

  it('Debería mostrar el reproductor cuando hay token y el usuario está autenticado', () => {
    spyOn(localStorage, 'getItem').and.returnValue('token');
    authSpy.estaAutenticado.and.returnValue(true);
    expect(component.estaLogueado()).toBeTrue();
    expect(component.mostrarSpotify).toBeTrue();
  });

  it('Debería setear el rol esAdministrador llamando a getRol', () => {
    authSpy.getRol.and.returnValue('Administrador');
    component.obtenerRolUsuario();
    expect(component.esAdministrador).toBeTrue();
  });

  it('Debería desactivar la sesión del administrador al cerrar sesión', () => {
    component.esAdministrador = true;
    component.cerrarSesion();
    expect(authSpy.cerrarSesion).toHaveBeenCalled();
    expect(component.esAdministrador).toBeFalse();
  });

});