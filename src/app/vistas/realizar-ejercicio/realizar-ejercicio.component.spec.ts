import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RealizarEjercicioComponent } from './realizar-ejercicio.component';
import { Router } from '@angular/router';
import { RutinaService } from '../../core/servicios/rutinaServicio/rutina.service';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TemporizadorComponent } from '../../compartido/componentes/temporizador/temporizador.component';
import { ToastrService, TOAST_CONFIG } from 'ngx-toastr';

describe('RealizarEjercicioComponent', () => {
  let component: RealizarEjercicioComponent;
  let fixture: ComponentFixture<RealizarEjercicioComponent>;
  let rutinaServiceMock: any;
  let routerMock: any;
  let temporizadorMock: any;
  let sanitizerMock: any;
  const toastrMock = jasmine.createSpyObj('ToastrService', ['success', 'error']);

  beforeEach(() => {
    rutinaServiceMock = jasmine.createSpyObj('RutinaService', [
      'cargarDesdeSession',
      'getDatosIniciales',
      'avanzarAlSiguienteEjercicio',
      'haySiguienteEjercicio',
    ]);

    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    temporizadorMock = jasmine.createSpyObj('TemporizadorService', [
      'estaCorriendoTiempo',
      'continuar',
      'accionesDePausa',
      'formatearTiempo',
    ]);

    sanitizerMock = jasmine.createSpyObj('DomSanitizer', [
      'bypassSecurityTrustResourceUrl',
    ]);

    TestBed.configureTestingModule({
      declarations: [RealizarEjercicioComponent, TemporizadorComponent],
      providers: [
        { provide: RutinaService, useValue: rutinaServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: TemporizadorService, useValue: temporizadorMock },
        { provide: DomSanitizer, useValue: sanitizerMock },
        { provide: ToastrService, useValue: toastrMock },
        { provide: TOAST_CONFIG, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RealizarEjercicioComponent);
    component = fixture.componentInstance;
  });

  it('debería redirigir si no hay rutina en sessionStorage', () => {
    dadoQueNoHayRutinaEnSession();
    cuandoSeLlamaNgOnInit();
    entoncesRedirigeALosPlanes();
  });

  it('debería iniciar el temporizador si el ejercicio es de tiempo', fakeAsync(() => {
    dadoQueHayRutinaYEsDeTiempo();
    cuandoSeInicializa();
    entoncesSeDisminuyeElTiempo();
  }));

  it('debería pausar y reanudar el temporizador al hacer click en botón de pausa', () => {
    dadoQueEstaCorriendo();
    cuandoHaceClickEnPausa();
    entoncesSePausaYLlamaAlServicio();
  });

  it('debería limpiar el intervalo de tiempo al destruir el componente', () => {
    spyOn(window, 'clearInterval');

    component.idIntervalo = 123;
    component.ngOnDestroy();

    expect(clearInterval).toHaveBeenCalledWith(123);
  });

  it('debería avanzar al siguiente ejercicio y redirigir a /informacion-ejercicio si hay más ejercicios', () => {
    rutinaServiceMock.haySiguienteEjercicio.and.returnValue(true);

    component.siguienteEjercicioRutina();

    expect(rutinaServiceMock.avanzarAlSiguienteEjercicio).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/informacion-ejercicio',
    ]);
  });

  it('debería redirigir a /finalizacion-rutina si no hay más ejercicios', () => {
    rutinaServiceMock.haySiguienteEjercicio.and.returnValue(false);

    component.siguienteEjercicioRutina();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/finalizacion-rutina']);
  });

  it('debería formatear el tiempo restante correctamente con cuentaRegresiva', () => {
    component.tiempoRestante = 25;
    temporizadorMock.formatearTiempo.and.returnValue('00:25');

    const resultado = component.cuentaRegresiva;

    expect(temporizadorMock.formatearTiempo).toHaveBeenCalledWith(25);
    expect(resultado).toBe('00:25');
  });

  it('debería calcular correctamente el porcentaje del progreso', () => {
    component.tiempoTotal = 100;
    component.tiempoRestante = 75;

    const resultado = component.porcentajeDelProgreso;

    expect(resultado).toBe(25);
  });

  it('debería devolver true en esAdvertencia si tiempoRestante <= 10', () => {
    component.tiempoRestante = 10;
    expect(component.esAdvertencia).toBeTrue();

    component.tiempoRestante = 5;
    expect(component.esAdvertencia).toBeTrue();
  });

  it('debería construir la url del video con los parámetros correctos', () => {
    const videoId = 'abc123';
    const tiempoInicio = '10';
    const urlEsperada = `https://www.youtube.com/embed/${videoId}?start=${tiempoInicio}&autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`;

    spyOn(component as any, 'extraerIdDelVideo').and.returnValue(videoId);
    spyOn(component as any, 'extraerTiempoDeInicio').and.returnValue(
      tiempoInicio
    );

    component['setearUrlDelVideo']('https://youtube.com/watch?v=abc123&t=10');

    expect(sanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      urlEsperada
    );
  });

  it('debería avanzar al siguiente ejercicio y redirigir al finalizar el temporizador', fakeAsync(() => {
    rutinaServiceMock.haySiguienteEjercicio.and.returnValue(false);
    rutinaServiceMock.avanzarAlSiguienteEjercicio.and.stub();

    component.estaPausado = false;
    component.tiempoTotal = 1;
    component.tiempoRestante = 1;

    component['iniciarTemporizador']();
    tick(1000);

    expect(rutinaServiceMock.avanzarAlSiguienteEjercicio).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/finalizacion-rutina']);
  }));

  it('no debería disminuir el tiempo si está pausado', fakeAsync(() => {
    component.estaPausado = true;
    component.tiempoTotal = 10;
    component.tiempoRestante = 10;

    component['iniciarTemporizador']();
    tick(1000);

    expect(component.tiempoRestante).toBe(10);
  }));

  it('debería redirigir a /informacion-ejercicio si hay siguiente ejercicio', () => {
    rutinaServiceMock.haySiguienteEjercicio.and.returnValue(true);

    component.siguienteEjercicioRutina();

    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/informacion-ejercicio',
    ]);
  });

  it('no debería iniciar temporizador si el ejercicio no es de tipo "De tiempo"', () => {
    rutinaServiceMock.getDatosIniciales.and.returnValue({
      rutina: {
        ejercicios: [{ tipoEjercicio: 'De repeticiones', duracion: 10 }],
      },
      indiceActual: 0,
      ejercicios: [],
      ejercicio: { tipoEjercicio: 'De repeticiones', duracion: 10 },
      duracionDelEjercicio: '10 repeticiones',
      repeticionesDelEjercicio: '10',
      correccionPremium: false,
    });

    const spy = spyOn(component as any, 'iniciarTemporizador');
    component.ngOnInit();

    expect(component.esEjercicioDeTiempo).toBeFalse();
    expect(spy).not.toHaveBeenCalled();
  });

  it('no debería llamar a iniciarTemporizador pero sí a setearUrlDelVideo para ejercicios “De repeticiones”', () => {
    rutinaServiceMock.getDatosIniciales.and.returnValue({
      rutina: { ejercicios: [{ tipoEjercicio: 'De repeticiones', duracion: 10, video: 'https://youtu.be/XYZ123abcDE' }] },
      indiceActual: 0,
      ejercicio: { tipoEjercicio: 'De repeticiones', duracion: 10, video: 'https://youtu.be/XYZ123abcDE' },
    });
    const spyTimer = spyOn(component as any, 'iniciarTemporizador');
    const spySetUrl = spyOn(component as any, 'setearUrlDelVideo');

    component.ngOnInit();

    expect(component.esEjercicioDeTiempo).toBeFalse();
    expect(spyTimer).not.toHaveBeenCalled();
    expect(spySetUrl).toHaveBeenCalledWith('https://youtu.be/XYZ123abcDE');
  });

  it('debería extraer correctamente el ID de YouTube con extraerIdDelVideo', () => {
    const fn = (component as any).extraerIdDelVideo.bind(component);
    expect(fn('https://www.youtube.com/watch?v=ABCDEFGHIJK')).toBe('ABCDEFGHIJK');
    expect(fn('https://youtu.be/12345678901')).toBe('12345678901');
    expect(fn('url inválida')).toBe('');
  });

  it('debería extraer correctamente el tiempo de inicio con extraerTiempoDeInicio', () => {
    const fn = (component as any).extraerTiempoDeInicio.bind(component);
    expect(fn('...?t=120')).toBe(120);
    expect(fn('...?start=50')).toBe(0);
    expect(fn('sin parámetro')).toBe(0);
  });

  it('debería mostrar toast.error y redirigir si no hay rutina en sessionStorage', () => {
    rutinaServiceMock.getDatosIniciales.and.returnValue({ rutina: null });

    toastrMock.error.calls.reset();

    component.ngOnInit();

    expect(toastrMock.error).toHaveBeenCalledTimes(1);
    expect(toastrMock.error).toHaveBeenCalledWith('No se encontró la rutina');

    expect(routerMock.navigate).toHaveBeenCalledWith(['/planes']);
  });

  it('debería llamar clearInterval(undefined) si idIntervalo nunca se asignó', () => {
    spyOn(window, 'clearInterval');
    component.idIntervalo = undefined;
    component.ngOnDestroy();
    expect(clearInterval).toHaveBeenCalledWith(undefined);
  });

  function dadoQueNoHayRutinaEnSession() {
    rutinaServiceMock.getDatosIniciales.and.returnValue({ rutina: null });
  }

  function cuandoSeLlamaNgOnInit() {
    component.ngOnInit();
  }

  function entoncesRedirigeALosPlanes() {
    expect(routerMock.navigate).toHaveBeenCalledWith(['/planes']);
  }
  function dadoQueEstaCorriendo() {
    component.estaPausado = false;
  }

  function cuandoHaceClickEnPausa() {
    component.botonPausa();
  }

  function entoncesSePausaYLlamaAlServicio() {
    expect(component.estaPausado).toBeTrue();
    expect(temporizadorMock.accionesDePausa).toHaveBeenCalledWith(true);
  }
  function dadoQueHayRutinaYEsDeTiempo() {
    rutinaServiceMock.getDatosIniciales.and.returnValue({
      rutina: {
        ejercicios: [{ tipoEjercicio: 'De tiempo', duracion: 30, video: '' }],
      },
      indiceActual: 0,
      ejercicios: [],
      ejercicio: { tipoEjercicio: 'De tiempo', duracion: 30, video: '' },
      duracionDelEjercicio: '30 segundos',
      repeticionesDelEjercicio: '',
      correccionPremium: false,
    });
    temporizadorMock.estaCorriendoTiempo.and.returnValue(true);
  }
  function cuandoSeInicializa() {
    component.ngOnInit();
    tick(1000);
  }

  function entoncesSeDisminuyeElTiempo() {
    expect(component.tiempoTotal).toBe(30);
    expect(component.tiempoRestante).toBeLessThan(30);
  }
});