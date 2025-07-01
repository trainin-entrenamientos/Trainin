import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EjercicioDiarioComponent } from './ejercicio-diario.component';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { EjercicioService } from '../../core/servicios/EjercicioServicio/ejercicio.service';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';
import { EjercicioDiarioDTO } from '../../core/modelos/EjercicioDiarioDTO';
import { RespuestaApi } from '../../core/modelos/RespuestaApiDTO';
import { Usuario } from '../../core/modelos/Usuario';
import { ToastrService } from 'ngx-toastr';

describe('EjercicioDiarioComponent', () => {
  let component: EjercicioDiarioComponent;
  let fixture: ComponentFixture<EjercicioDiarioComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let ejercicioServiceSpy: jasmine.SpyObj<EjercicioService>;
  let temporizadorServiceSpy: jasmine.SpyObj<TemporizadorService>;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  const mockEjercicioDiario: EjercicioDiarioDTO = {
    id: 1,
    nombre: 'Ejercicio Test',
    descripcion: '1) Primer paso del ejercicio 2) Segundo paso del ejercicio 3) Tercer paso',
    video: 'https://www.youtube.com/watch?v=testVideoId',
    imagen: 'test-image.jpg',
    tiempo: 120,
    repeticiones: 10,
    idTipoEjercicio: 1
  };

  const mockUsuarioResponse: RespuestaApi<Usuario> = {
    exito: true,
    mensaje: 'Usuario obtenido correctamente',
    objeto: {
      id: 123,
      nombre: 'Test',
      apellido: 'User',
      contraseña: 'hashed-password',
      email: 'test@example.com',
      esPremium: true,
      caloriasTotales: 2000,
      altura: 1.75
    }
  };

  const mockEjercicioResponse: RespuestaApi<EjercicioDiarioDTO> = {
    exito: true,
    mensaje: 'Ejercicio obtenido correctamente',
    objeto: mockEjercicioDiario
  };

  beforeEach(async () => {
    const toastrSpyObj = jasmine.createSpyObj('ToastrService', ['error']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getEmail']);
    const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['obtenerUsuarioPorEmail']);
    const ejercicioSpy = jasmine.createSpyObj('EjercicioService', [
      'obtenerEjercicioDiario',
      'marcarEjercicioDiarioRealizado'
    ]);
    const temporizadorSpy = jasmine.createSpyObj('TemporizadorService', ['formatearTiempo']);
    const domSanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [EjercicioDiarioComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: EjercicioService, useValue: ejercicioSpy },
        { provide: TemporizadorService, useValue: temporizadorSpy },
        { provide: DomSanitizer, useValue: domSanitizerSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ToastrService, useValue: toastrSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EjercicioDiarioComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    usuarioServiceSpy = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    ejercicioServiceSpy = TestBed.inject(EjercicioService) as jasmine.SpyObj<EjercicioService>;
    temporizadorServiceSpy = TestBed.inject(TemporizadorService) as jasmine.SpyObj<TemporizadorService>;
    sanitizerSpy = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastrSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  beforeEach(() => {
    const mockSafeUrl = 'safe-url' as any as SafeResourceUrl;
    sanitizerSpy.bypassSecurityTrustResourceUrl.and.returnValue(mockSafeUrl);
    authServiceSpy.getEmail.and.returnValue('test@example.com');
    usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(of(mockUsuarioResponse));
    ejercicioServiceSpy.obtenerEjercicioDiario.and.returnValue(of(mockEjercicioResponse));
    ejercicioServiceSpy.marcarEjercicioDiarioRealizado.and.returnValue(of({
      exito: true,
      mensaje: 'Ejercicio marcado como realizado',
      objeto: 'success'
    })
    );
    temporizadorServiceSpy.formatearTiempo.and.returnValue('02:00');
  });

  it('deberia crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('deberia inicializar el componente correctamente', () => {
      component.ngOnInit();

      expect(authServiceSpy.getEmail).toHaveBeenCalled();
      expect(component.email).toBe('test@example.com');
      expect(sanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalled();
    });

    it('debería llamar a obtenerUsuario si hay email', () => {
      spyOn(component, 'obtenerUsuario');

      component.ngOnInit();

      expect(component.obtenerUsuario).toHaveBeenCalled();
    });
  });

  describe('obtenerUsuario', () => {
    it('debería obtener el usuario correctamente y llamar a obtenerEjercicioDiario', () => {
      spyOn(component, 'obtenerEjercicioDiario');
      component.email = 'test@example.com';

      component.obtenerUsuario();

      expect(usuarioServiceSpy.obtenerUsuarioPorEmail).toHaveBeenCalledWith('test@example.com');
      expect(component.idUsuario).toBe(123);
      expect(component.obtenerEjercicioDiario).toHaveBeenCalled();
    });

    it('no debería llamar al servicio si el email es null', () => {
      component.email = null;

      component.terminarEjercicioDiario();

      expect(toastrSpy.error).toHaveBeenCalledWith(
        jasmine.stringMatching('No se puede marcar el ejercicio como realizado: email es null')
      );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
      expect(ejercicioServiceSpy.marcarEjercicioDiarioRealizado).not.toHaveBeenCalled();
    });

    it('debería manejar errores al obtener el usuario', () => {
      spyOn(console, 'error');
      usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(throwError(() => new Error('Test error')));
      component.email = 'test@example.com';

      component.obtenerUsuario();

      expect(console.error).toHaveBeenCalledWith('Error al obtener el usuario:', jasmine.any(Error));
    });
  });

  describe('obtenerEjercicioDiario', () => {
    beforeEach(() => {
      component.email = 'test@example.com';
    });

    it('debería obtener el ejercicio diario correctamente', () => {
      component.obtenerEjercicioDiario();

      expect(ejercicioServiceSpy.obtenerEjercicioDiario).toHaveBeenCalledWith('test@example.com');
      expect(component.ejercicioDiario).toEqual(mockEjercicioDiario);
      expect(component.descripcionLista).toEqual(['Primer paso del ejercicio', 'Segundo paso del ejercicio', 'Tercer paso']);
    });

    it('debería procesar URL de YouTube (formato largo)', () => {
      const mockResponse = {
        exito: true,
        mensaje: 'ok',
        objeto: {
          ...mockEjercicioDiario,
          video: 'https://www.youtube.com/watch?v=testVideoId&feature=share'
        }
      };
      ejercicioServiceSpy.obtenerEjercicioDiario.and.returnValue(of(mockResponse));

      component.obtenerEjercicioDiario();

      expect(sanitizerSpy.bypassSecurityTrustResourceUrl)
        .toHaveBeenCalledWith('https://www.youtube.com/embed/testVideoId?autoplay=1');
    });

    it('debería procesar URL de YouTube (formato corto)', () => {
      const mockResponse = {
        exito: true,
        mensaje: 'ok',
        objeto: {
          ...mockEjercicioDiario,
          video: 'https://youtu.be/testVideoId?si=xyz123'
        }
      };
      ejercicioServiceSpy.obtenerEjercicioDiario.and.returnValue(of(mockResponse));

      component.obtenerEjercicioDiario();

      expect(sanitizerSpy.bypassSecurityTrustResourceUrl)
        .toHaveBeenCalledWith('https://www.youtube.com/embed/testVideoId?autoplay=1');
    });

    it('debería manejar el caso de email null', () => {
      component.email = null;

      component.obtenerEjercicioDiario();

      expect(ejercicioServiceSpy.obtenerEjercicioDiario).not.toHaveBeenCalled();
      expect(toastrSpy.error).toHaveBeenCalledWith('Email es null o invalido');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
    });

    it('debería manejar respuesta nula del servicio', () => {
      component.email = 'test@example.com';

      const respuestaNula = of({
        exito: false,
        mensaje: '',
        objeto: null
      } as unknown as RespuestaApi<EjercicioDiarioDTO>);
      ejercicioServiceSpy.obtenerEjercicioDiario.and.returnValue(respuestaNula);

      component.obtenerEjercicioDiario();

      expect(toastrSpy.error).toHaveBeenCalledWith('No se encontró ejercicio diario para el usuario.');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
    });

    it('debería manejar errores al obtener el ejercicio diario', () => {
      spyOn(console, 'error');
      ejercicioServiceSpy.obtenerEjercicioDiario.and.returnValue(throwError(() => new Error('Test error')));

      component.obtenerEjercicioDiario();

      expect(console.error).toHaveBeenCalledWith('Error al obtener el ejercicio:', jasmine.any(Error));
    });
  });

  describe('separarPasos', () => {
    it('debería separar correctamente los pasos del texto', () => {
      const texto = '1) Primer paso 2) Segundo paso 3) Tercer paso';
      const resultado = component.separarPasos(texto);

      expect(resultado).toEqual(['Primer paso', 'Segundo paso', 'Tercer paso']);
    });

    it('debería retornar lista vacía para string vacío', () => {
      const resultado = component.separarPasos('');
      expect(resultado).toEqual([]);
    });

    it('debería retornar lista vacía si no hay pasos numerados', () => {
      const texto = 'Texto sin pasos numerados';
      const resultado = component.separarPasos(texto);
      expect(resultado).toEqual([]);
    });

    it('debería eliminar espacios extra en los pasos', () => {
      const texto = '1)   Primer paso con espacios   2)   Segundo paso   ';
      const resultado = component.separarPasos(texto);
      expect(resultado).toEqual(['Primer paso con espacios', 'Segundo paso']);
    });
  });

  describe('iniciarEjercicioTemporizado', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
      if (component.intervaloCuentaAtras) {
        clearInterval(component.intervaloCuentaAtras);
      }
    });

    it('debería iniciar la cuenta regresiva y comenzar el temporizador', () => {
      spyOn(component, 'comenzarTemporizador');

      component.iniciarEjercicioTemporizado();

      expect(component.mostrarCuentaAtras).toBe(true);
      expect(component.cuentaRegresiva).toBe('3');

      jasmine.clock().tick(1000);
      expect(component.cuentaRegresiva).toBe('2');

      jasmine.clock().tick(1000);
      expect(component.cuentaRegresiva).toBe('1');

      jasmine.clock().tick(1000);
      expect(component.cuentaRegresiva).toBe('¡Vamos!');

      jasmine.clock().tick(1000);
      expect(component.mostrarCuentaAtras).toBe(false);
      expect(component.comenzarTemporizador).toHaveBeenCalled();
    });
  });

  describe('comenzarTemporizador', () => {
    beforeEach(() => {
      jasmine.clock().install();
      component.ejercicioDiario = mockEjercicioDiario;
    });

    afterEach(() => {
      jasmine.clock().uninstall();
      if (component.intervaloTemporizador) {
        clearInterval(component.intervaloTemporizador);
      }
    });

    it('debería iniciar el temporizador correctamente', () => {
      component.comenzarTemporizador();

      expect(component.estaIniciado).toBe(true);
      expect(component.tiempoRestante).toBe(120);

      jasmine.clock().tick(1000);
      expect(component.tiempoRestante).toBe(119);
      expect(component.porcentajeDelProgreso).toBeCloseTo(0.83, 1);
      expect(temporizadorServiceSpy.formatearTiempo).toHaveBeenCalledWith(119);
    });

    it('debería marcar el tiempo como finalizado cuando llegue a cero', () => {
      component.ejercicioDiario = { ...mockEjercicioDiario, tiempo: 2 };

      component.comenzarTemporizador();

      jasmine.clock().tick(2000);

      expect(component.tiempoRestante).toBe(0);
      expect(component.porcentajeDelProgreso).toBe(100);
      expect(component.tiempoFinalizado).toBe(true);
    });

    it('no debería iniciar si ejercicioDiario es null', () => {
      component.ejercicioDiario = null;

      component.comenzarTemporizador();

      expect(component.estaIniciado).toBe(false);
    });

    it('no debería iniciar si el tiempo es cero o no está definido', () => {
      component.ejercicioDiario = { ...mockEjercicioDiario, tiempo: 0 };

      component.comenzarTemporizador();

      expect(component.estaIniciado).toBe(false);
    });
  });

  describe('terminarEjercicioDiario', () => {
    it('debería marcar el ejercicio como completado y navegar', () => {
      component.email = 'test@example.com';

      component.terminarEjercicioDiario();

      expect(ejercicioServiceSpy.marcarEjercicioDiarioRealizado).toHaveBeenCalledWith('test@example.com');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
    });

    it('no debería llamar al servicio si el email es null', () => {
      component.email = null;

      component.terminarEjercicioDiario();

      expect(toastrSpy.error).toHaveBeenCalledWith('No se puede marcar el ejercicio como realizado: email es null');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
      expect(ejercicioServiceSpy.marcarEjercicioDiarioRealizado).not.toHaveBeenCalled();
    });

    it('debería manejar error del servicio y mostrar toastr + redirigir', () => {
      component.email = 'test@example.com';
      ejercicioServiceSpy.marcarEjercicioDiarioRealizado.and.returnValue(throwError(() => new Error('Service error')));

      component.terminarEjercicioDiario();

      expect(toastrSpy.error).toHaveBeenCalledWith('Error al marcar el ejercicio diario como realizado.');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
    });
  });

  describe('Limpieza del componente', () => {
    it('debería limpiar los intervalos al destruir el componente', () => {
      component.intervaloCuentaAtras = setInterval(() => { }, 1000);
      component.intervaloTemporizador = setInterval(() => { }, 1000);

      spyOn(window, 'clearInterval');

      fixture.destroy();

    });
  });

  describe('Casos extremos e integración', () => {
    it('debería manejar el flujo completo desde inicialización hasta finalización', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component.email).toBe('test@example.com');
      expect(component.idUsuario).toBe(123);
      expect(component.ejercicioDiario).toEqual(mockEjercicioDiario);

      component.iniciarEjercicioTemporizado();
      tick(4000);

      expect(component.estaIniciado).toBe(true);
      expect(component.mostrarCuentaAtras).toBe(false);

      component.terminarEjercicioDiario();
      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
    }));


  });
});