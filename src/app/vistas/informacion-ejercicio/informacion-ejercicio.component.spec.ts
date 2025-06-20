import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { InformacionEjercicioComponent } from './informacion-ejercicio.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { waitForAsync } from '@angular/core/testing';
import { RutinaService } from '../../core/servicios/rutinaServicio/rutina.service';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { Rutina, Ejercicio } from '../../core/modelos/RutinaDTO';
import { NombreEjercicio } from '../../compartido/enums/nombre-ejercicio.enum';
import { TemporizadorComponent } from '../../compartido/componentes/temporizador/temporizador.component';

describe('InformacionEjercicioComponent', () => {
  let component: InformacionEjercicioComponent;
  let fixture: ComponentFixture<InformacionEjercicioComponent>;
  let rutinaServiceMock: jasmine.SpyObj<RutinaService>;
  let routerMock: jasmine.SpyObj<Router>;
  let temporizadorServiceMock: jasmine.SpyObj<TemporizadorService>;
  let usuarioServiceMock: jasmine.SpyObj<UsuarioService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    rutinaServiceMock = jasmine.createSpyObj('RutinaService', [
      'cargarDesdeSession',
      'getDatosIniciales',
      'getIndiceActual',
      'buscarNombreEjercicio',
    ]);

    rutinaServiceMock.getDatosIniciales.and.returnValue({
      rutina: {
        id: 0,
        numeroRutina: 0,
        duracionEstimada: 0,
        nombre: '',
        ejercicios: [],
        categoriaEjercicio: '',
        rutinasRealizadas: 0,
        caloriasQuemadas: 0,
      },
      ejercicios: [],
      indiceActual: 0,
      ejercicio: {} as Ejercicio,
      duracionDelEjercicio: '',
      repeticionesDelEjercicio: '',
      correccionPremium: false,
    });

    rutinaServiceMock.getIndiceActual.and.returnValue(0);
    rutinaServiceMock.buscarNombreEjercicio.and.returnValue(
      NombreEjercicio.SENTADILLA
    );

    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    temporizadorServiceMock = jasmine.createSpyObj('TemporizadorService', [
      'estaCorriendoTiempo',
      'continuar',
      'accionesDePausa',
      'formatearTiempo',
      'obtenerSegundosTranscurridos',
    ]);

    temporizadorServiceMock.obtenerSegundosTranscurridos.and.returnValue(0);

    usuarioServiceMock = jasmine.createSpyObj('UsuarioService', [
      'obtenerUsuarioPorId',
    ]);
    usuarioServiceMock.obtenerUsuarioPorEmail.and.returnValue(
      of({ id: 4, nombre: 'Facundo' })
    );

    authServiceMock = jasmine.createSpyObj('AuthService', ['getEmail']);
    authServiceMock.getEmail.and.returnValue('facu@gmail.com');

    TestBed.configureTestingModule({
      declarations: [InformacionEjercicioComponent, TemporizadorComponent],
      providers: [
        { provide: RutinaService, useValue: rutinaServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: TemporizadorService, useValue: temporizadorServiceMock },
        { provide: UsuarioService, useValue: usuarioServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    fixture = TestBed.createComponent(InformacionEjercicioComponent);
    component = fixture.componentInstance;
  });

  it('debería redirigir si no hay rutina', () => {
    dadoQueNoHayRutina();
    cuandoSeEjecutaOnInit();
    entoncesDeberiaRedirigirAPlanes();
  });

  it('debería establecer datos iniciales si hay rutina', () => {
    dadoQueHayRutinaYEjercicio();
    cuandoSeEjecutaOnInit();
    entoncesDebeTenerDatosIniciales();
  });

  it('debería establecer esUsuarioPremium en true si el usuario es premium', fakeAsync(() => {
    dadoQueHayRutinaYEjercicio();
    dadoQueElEmailEs('premium@gmail.com');
    dadoQueElUsuarioEsPremium();
    cuandoSeEjecutaOnInit();
    tick();
    fixture.detectChanges();
    entoncesDebeSerUsuarioPremium();
  }));

  it('no debería establecer esUsuarioPremium en true si el usuario no es premium', fakeAsync(() => {
    dadoQueHayRutinaYEjercicio();
    dadoQueElEmailEs('nopremium@gmail.com');
    dadoQueElUsuarioNoEsPremium();
    cuandoSeEjecutaOnInit();
    tick();
    fixture.detectChanges();
    entoncesNoDebeSerUsuarioPremium();
  }));

  it('debería manejar error al obtener usuario', fakeAsync(() => {
    dadoQueHayRutinaYEjercicio();
    dadoQueElEmailEs('error@gmail.com');
    dadoQueObtenerUsuarioFalla();
    cuandoSeEjecutaOnInit();
    tick();
    fixture.detectChanges();
    entoncesNoDebeTenerUsuario();
  }));

  it('debería obtener la clave del ejercicio de corrección si encuentra al ejercicio', () => {
    dadoQueEjercicioActualEs('sentadilla');
    rutinaServiceMock.buscarNombreEjercicio.and.returnValue(
      NombreEjercicio.SENTADILLA
    );
    entoncesClaveDeCorreccionDebeSer(NombreEjercicio.SENTADILLA);
  });

  it('debería devolver un ejercicio "ERROR" si no encuentra la clave del ejercicio correcta', () => {
    dadoQueEjercicioActualEs('Inexistente');
    rutinaServiceMock.buscarNombreEjercicio.and.returnValue(null);
    entoncesClaveDeCorreccionDebeSer(NombreEjercicio.ERROR);
  });

  it('no debería disminuir el tiempo si está pausado', fakeAsync(() => {
    dadoQueEstaPausadoConTiempo(10);
    cuandoIniciaCuentaRegresivaYAvanza(3000);
    entoncesTiempoRestanteDebeSer(10);
  }));

  it('debería avanzar a la vista de realizar ejercicio al finalizar temporizador', fakeAsync(() => {
    dadoQueEstaActivoConTiempo(2);
    cuandoIniciaCuentaRegresivaYAvanza(2100);
    entoncesDebeRedirigirARelizarEjercicio();
  }));

  it('debería pausar y reanudar el temporizador al hacer click en botón de pausa', () => {
    dadoQueEstaCorriendo();
    cuandoHaceClickEnPausa();
    entoncesSePausaYLlamaAlServicio();
    cuandoHaceClickEnPausa();
    entoncesSeReanudaYLlamaAlServicio();
  });

  function dadoQueNoHayRutina() {
    rutinaServiceMock.getDatosIniciales.and.returnValue({
      rutina: null,
      indiceActual: 0,
      ejercicios: [],
      ejercicio: {} as Ejercicio,
      duracionDelEjercicio: '',
      repeticionesDelEjercicio: '',
      correccionPremium: false,
    });
  }

  function dadoQueHayRutinaYEjercicio() {
    rutinaServiceMock.getDatosIniciales.and.returnValue({
      rutina: { duracionEstimada: 1 } as Rutina,
      ejercicio: { nombre: 'sentadilla' } as Ejercicio,
      indiceActual: 0,
      ejercicios: [],
      duracionDelEjercicio: '',
      repeticionesDelEjercicio: '',
      correccionPremium: false,
    });
    temporizadorServiceMock.formatearTiempo.and.returnValue('00:10');
  }

  function dadoQueElEmailEs(email: string | null) {
    authServiceMock.getEmail.and.returnValue(email);
  }

  function dadoQueElUsuarioEsPremium() {
    usuarioServiceMock.obtenerUsuarioPorEmail.and.returnValue(
      of({ id: 1, nombre: 'Usuario Premium', esPremium: true })
    );
  }

  function dadoQueElUsuarioNoEsPremium() {
    usuarioServiceMock.obtenerUsuarioPorEmail.and.returnValue(
      of({ id: 1, nombre: 'Usuario Gratuito', esPremium: false })
    );
  }

  function dadoQueObtenerUsuarioFalla() {
    usuarioServiceMock.obtenerUsuarioPorEmail.and.returnValue(
      throwError(() => new Error('Error usuario'))
    );
  }

  function dadoQueEjercicioActualEs(nombre: string) {
    component.ejercicio = { nombre } as Ejercicio;
    rutinaServiceMock.buscarNombreEjercicio.and.returnValue(
      NombreEjercicio[nombre as keyof typeof NombreEjercicio]
    );
  }

  function dadoQueEstaPausadoConTiempo(tiempo: number) {
    component.tiempoRestante = tiempo;
    component.estaPausado = true;
  }

  function dadoQueEstaActivoConTiempo(tiempo: number) {
    component.tiempoRestante = tiempo;
    component.estaPausado = false;
  }

  function dadoQueEstaCorriendo() {
    component.estaPausado = false;
  }

  function cuandoSeEjecutaOnInit() {
    component.ngOnInit();
  }

  function cuandoIniciaCuentaRegresivaYAvanza(ms: number) {
    component['iniciarCuentaRegresiva']();
    tick(ms);
    clearInterval(component['idIntervalo']);
  }

  function cuandoHaceClickEnPausa() {
    component.botonPausar();
  }

  function entoncesDeberiaRedirigirAPlanes() {
    expect(routerMock.navigate).toHaveBeenCalledWith(['/planes']);
  }

  function entoncesDebeTenerDatosIniciales() {
    expect(component.rutina).toBeDefined();
    expect(component.ejercicio).toBeDefined();
  }

  function entoncesDebeSerUsuarioPremium() {
    expect(component.esUsuarioPremium).toBeTrue();
  }

  function entoncesNoDebeSerUsuarioPremium() {
    expect(component.esUsuarioPremium).toBeFalse();
  }

  function entoncesNoDebeTenerUsuario() {
    expect(component.usuario).toBeUndefined();
  }

  function entoncesClaveDeCorreccionDebeSer(clave: NombreEjercicio) {
    const resultado = component.claveEjercicioCorreccion();
    expect(resultado).toBe(clave);
  }

  function entoncesTiempoRestanteDebeSer(tiempo: number) {
    expect(component.tiempoRestante).toBe(tiempo);
  }

  function entoncesDebeRedirigirARelizarEjercicio() {
    expect(routerMock.navigate).toHaveBeenCalledWith(['/realizar-ejercicio']);
  }

  function entoncesSePausaYLlamaAlServicio() {
    expect(component.estaPausado).toBeTrue();
    expect(temporizadorServiceMock.accionesDePausa).toHaveBeenCalledWith(true);
  }

  function entoncesSeReanudaYLlamaAlServicio() {
    expect(component.estaPausado).toBeFalse();
    expect(temporizadorServiceMock.accionesDePausa).toHaveBeenCalledWith(false);
  }
});
