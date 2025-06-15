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
import { of, throwError } from 'rxjs';
import { ElementRef, QueryList } from '@angular/core';

describe('PlanPremiumComponent', () => {
  let component: PlanPremiumComponent;
  let fixture: ComponentFixture<PlanPremiumComponent>;
  let mockAuthService: any;
  let mockMercadoPagoService: any;
  let mockUsuarioService: any;
  let hrefSpy: jasmine.Spy;

  beforeEach(() => {
    

    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getEmail',
      'estaAutenticado',
    ]);
    mockMercadoPagoService = jasmine.createSpyObj('MercadoPagoService', [
      'pagarSuscripcionPremium',
    ]);
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', [
      'obtenerUsuarioPorId',
    ]);

    TestBed.configureTestingModule({
      declarations: [PlanPremiumComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MercadoPagoService, useValue: mockMercadoPagoService },
        { provide: UsuarioService, useValue: mockUsuarioService },
      ],
    });

    fixture = TestBed.createComponent(PlanPremiumComponent);
    component = fixture.componentInstance;
  });
  

  it('debería obtener el usuario si hay email en ngOnInit', () => {
    dadoQueElUsuarioEstaLogueadoConEmailValido();
    cuandoSeLlamaANgOnInit();
    entoncesSeObtieneElUsuarioCorrectamente();
  });

  it('debería devolver true si el usuario está autenticado', () => {
    dadoQueElUsuarioEstaAutenticado();
    entoncesElMetodoEstaLogueadoDevuelveTrue();
  });

  it('debería redireccionar a la URL de pago si la respuesta es válida', () => {
    dadoQueElUsuarioTieneUnIDValido();
    dadoQueLaRespuestaDePagoEsValida();
    cuandoSeInvocaPagarPremium();
    entoncesSeRedireccionaALaURLDePago();
  });

  it('debería lanzar un error si la respuesta del pago es inválida', () => {
    dadoQueElUsuarioTieneUnIDValido();
    dadoQueLaRespuestaDePagoEsInvalida();
    cuandoSeInvocaPagarPremium();
    entoncesSeLanzaErrorDeRedireccion();
  });

  it('debería lanzar un error si obtenerUsuarioPorEmail falla', () => {
    dadoQueLaLlamadaALaAPIFalla();
    cuandoSeLlamaANgOnInit();
    entoncesSeLanzaElErrorDeUsuario();
  });

  it('debería agregar la clase visible cuando el elemento entra en el viewport', () => {
    const mockElement = {
      nativeElement: document.createElement('div'),
    } as ElementRef<HTMLDivElement>;

    const queryList = new QueryList<ElementRef<HTMLDivElement>>();
    (queryList as any).reset([mockElement]);
    component.cardFeatures = queryList;

    const observeSpy = spyOn(
      window as any,
      'IntersectionObserver'
    ).and.callFake(function (cb: any) {
      cb([{ isIntersecting: true, target: mockElement.nativeElement }]);
      return {
        observe: jasmine.createSpy('observe'),
      };
    });

    component.ngAfterViewInit();
    expect(observeSpy).toHaveBeenCalled();
  });

  function dadoQueElUsuarioEstaLogueadoConEmailValido() {
    mockAuthService.getEmail.and.returnValue('melina@example.com');
    const usuarioResponse = { id: 42, esPremium: true };
    mockUsuarioService.obtenerUsuarioPorId.and.returnValue(of(usuarioResponse));
  }

  function cuandoSeLlamaANgOnInit() {
    component.ngOnInit();
  }

  function entoncesSeObtieneElUsuarioCorrectamente() {
    expect(component.usuario.idUsuario).toBe(42);
    expect(component.usuario.esPremium).toBeTrue();
  }

  function dadoQueElUsuarioEstaAutenticado() {
    mockAuthService.estaAutenticado.and.returnValue(true);
  }

  function entoncesElMetodoEstaLogueadoDevuelveTrue() {
    expect(component.estaLogueado()).toBeTrue();
  }

  function dadoQueElUsuarioTieneUnIDValido() {
    component.usuario.idUsuario = 123;
  }

function dadoQueLaRespuestaDePagoEsValida() {
  spyOn(component, 'redirigir');
  mockMercadoPagoService.pagarSuscripcionPremium.and.returnValue(
    of({ url: 'https://pago.com/checkout' })
  );
}

  function cuandoSeInvocaPagarPremium() {
    component.pagarPremium();
  }

  function entoncesSeRedireccionaALaURLDePago() {
    expect(component.redirigir).toHaveBeenCalledWith('https://pago.com/checkout');
  }

  function dadoQueLaRespuestaDePagoEsInvalida() {
    mockMercadoPagoService.pagarSuscripcionPremium.and.returnValue(of({}));
    spyOn(console, 'error');
  }

  function entoncesSeLanzaErrorDeRedireccion() {
    expect(console.error).toHaveBeenCalledWith(
      'Error al obtener el punto de inicio de pago:',
      {}
    );
  }

  function dadoQueLaLlamadaALaAPIFalla() {
    mockUsuarioService.obtenerUsuarioPorId.and.returnValue(
      throwError(() => 'Error del servidor')
    );
    mockAuthService.getEmail.and.returnValue('melina@example.com');
    spyOn(console, 'error');
  }

  function entoncesSeLanzaElErrorDeUsuario() {
    expect(console.error).toHaveBeenCalledWith(
      'Error al obtener el usuario:',
      'Error del servidor'
    );
  }
});
