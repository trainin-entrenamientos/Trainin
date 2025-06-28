import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PlanPremiumComponent } from './plan-premium.component';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { MercadoPagoService } from '../../core/servicios/mercadoPagoServicio/mercado-pago.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { ElementRef, QueryList } from '@angular/core';
import { Usuario } from '../../core/modelos/Usuario';

describe('PlanPremiumComponent', () => {
  let component: PlanPremiumComponent;
  let fixture: ComponentFixture<PlanPremiumComponent>;

  // Mocks
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockMercadoPagoService: jasmine.SpyObj<MercadoPagoService>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;
  let mockToastr: jasmine.SpyObj<ToastrService>;

  // Mock IntersectionObserver global para evitar errores en tests
  const observeSpy = jasmine.createSpy('observe');
  const unobserveSpy = jasmine.createSpy('unobserve');
  const disconnectSpy = jasmine.createSpy('disconnect');
  class MockIntersectionObserver {
    constructor(private callback: any, private options: any) {}
    observe = observeSpy;
    unobserve = unobserveSpy;
    disconnect = disconnectSpy;
  }

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getEmail',
      'estaAutenticado',
    ]);
    mockMercadoPagoService = jasmine.createSpyObj('MercadoPagoService', [
      'pagarSuscripcionPremium',
    ]);
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', [
      'obtenerUsuarioPorEmail',
    ]);
    mockToastr = jasmine.createSpyObj('ToastrService', ['error']);

    // Reemplazamos IntersectionObserver global
    (window as any).IntersectionObserver = MockIntersectionObserver;

    await TestBed.configureTestingModule({
      declarations: [PlanPremiumComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MercadoPagoService, useValue: mockMercadoPagoService },
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: ToastrService, useValue: mockToastr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanPremiumComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debe obtener email y llamar a obtenerUsuarioPorEmail si hay email', () => {
      const email = 'user@test.com';
      mockAuthService.getEmail.and.returnValue(email);
      spyOn(component, 'obtenerUsuarioPorEmail');

      component.ngOnInit();

      expect(component.email).toBe(email);
      expect(component.obtenerUsuarioPorEmail).toHaveBeenCalled();
    });

    it('no debe llamar a obtenerUsuarioPorEmail si email es null', () => {
      mockAuthService.getEmail.and.returnValue(null);
      spyOn(component, 'obtenerUsuarioPorEmail');

      component.ngOnInit();

      expect(component.email).toBeNull();
      expect(component.obtenerUsuarioPorEmail).not.toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('debe crear observer y observar todos los elementos cardFeatures', () => {
      // Creamos mocks para cardFeatures
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');

      component.cardFeatures = new QueryList<ElementRef<HTMLDivElement>>();
      component.cardFeatures.reset([
        new ElementRef(div1),
        new ElementRef(div2),
      ]);

      component.ngAfterViewInit();

      // Debe llamar observe para cada div
      expect(observeSpy).toHaveBeenCalledWith(div1);
      expect(observeSpy).toHaveBeenCalledWith(div2);
      expect(observeSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('estaLogueado', () => {
    it('debe retornar lo que devuelva authService.estaAutenticado', () => {
      mockAuthService.estaAutenticado.and.returnValue(true);
      expect(component.estaLogueado()).toBeTrue();

      mockAuthService.estaAutenticado.and.returnValue(false);
      expect(component.estaLogueado()).toBeFalse();
    });
  });

  describe('redirigir', () => {
    it('debe llamar asignarLocation con la url pasada', () => {
      const url = 'https://ejemplo.com/pago';
      spyOn(component, 'asignarLocation');

      component.redirigir(url);

      expect(component.asignarLocation).toHaveBeenCalledWith(url);
    });
  });

  describe('pagarPremium', () => {
    beforeEach(() => {
      component.usuario = { idUsuario: 42 };
    });

    it('debe llamar mercadoPagoServicio y redirigir si response correcto', () => {
      const urlPago = 'https://mercadopago.com/iniciar';
      mockMercadoPagoService.pagarSuscripcionPremium.and.returnValue(
        of({
          exito: true,
          mensaje: 'URL generada correctamente',
          objeto: urlPago,
        })
      );
      spyOn(component, 'redirigir');

      component.pagarPremium();

      expect(
        mockMercadoPagoService.pagarSuscripcionPremium
      ).toHaveBeenCalledWith(42, 1);
      expect(component.redirigir).toHaveBeenCalledWith(urlPago);
    });

    it('debe mostrar error si response no tiene objeto', () => {
      mockMercadoPagoService.pagarSuscripcionPremium.and.returnValue(
        of({
          exito: false,
          mensaje: 'No se generó el link',
          objeto: '',
        })
      );

      component.pagarPremium();

      expect(mockToastr.error).toHaveBeenCalledWith(
        'Error al obtener el punto de inicio de pago'
      );
    });

    it('debe mostrar error si hay error en suscripcion', () => {
      mockMercadoPagoService.pagarSuscripcionPremium.and.returnValue(
        throwError(() => new Error('fail'))
      );

      component.pagarPremium();

      expect(mockToastr.error).toHaveBeenCalledWith(
        'Error al procesar el pago'
      );
    });
  });

  describe('obtenerUsuarioPorEmail', () => {
    beforeEach(() => {
      component.email = 'user@test.com';
    });

    it('debe setear usuario correctamente si response tiene objeto', () => {
      const usuarioMock = new Usuario(
        55,
        'Facundo',
        'Gonzalez',
        'facu@test.com',
        '1234',
        true,
        2000,
        175
      );

      const response = {
        exito: true,
        mensaje: 'Usuario encontrado',
        objeto: usuarioMock,
      };

      mockUsuarioService.obtenerUsuarioPorEmail.and.returnValue(of(response));

      component.obtenerUsuarioPorEmail();

      expect(component.usuario.idUsuario).toBe(55);
      expect(component.usuario.esPremium).toBeTrue();
    });

    it('debe setear esPremium false si no viene en response', () => {
      const response = {
        exito: true,
        mensaje: 'Usuario encontrado',
        objeto: new Usuario(
          55,
          'Facu',
          'Tester',
          'facu@test.com',
          'password123',
          true, // este valor va a ser ignorado por el método, se sobreescribe
          1000,
          180
        ),
      };

      // Simulamos que el campo esPremium viene undefined
      delete (response.objeto as any).esPremium;

      mockUsuarioService.obtenerUsuarioPorEmail.and.returnValue(of(response));

      component.obtenerUsuarioPorEmail();

      expect(component.usuario.idUsuario).toBe(55);
      expect(component.usuario.esPremium).toBeFalse();
    });

    it('debe mostrar error si response es null', () => {
      mockUsuarioService.obtenerUsuarioPorEmail.and.returnValue(
        of({
          exito: false,
          mensaje: 'Usuario no encontrado',
          objeto: null as any,
        })
      );

      component.obtenerUsuarioPorEmail();

      expect(mockToastr.error).toHaveBeenCalledWith(
        'No se pudo obtener al usuario'
      );
    });

    it('debe mostrar error si hay error en obtener usuario', () => {
      mockUsuarioService.obtenerUsuarioPorEmail.and.returnValue(
        throwError(() => new Error('fail'))
      );

      component.obtenerUsuarioPorEmail();

      expect(mockToastr.error).toHaveBeenCalledWith(
        'Error al obtener el usuario'
      );
    });
  });
});
