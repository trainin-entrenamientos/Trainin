/*import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioRutinaComponent } from './inicio-rutina.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RutinaService } from '../../core/servicios/rutinaServicio/rutina.service';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';
import { Rutina } from '../../core/modelos/RutinaDTO';
import { ToastrService } from 'ngx-toastr';

describe('InicioRutinaComponent', () => {
  let component: InicioRutinaComponent;
  let fixture: ComponentFixture<InicioRutinaComponent>;
  let rutinaServiceSpy: jasmine.SpyObj<RutinaService>;
  let temporizadorServiceSpy: jasmine.SpyObj<TemporizadorService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  const rutinaMock: Rutina = {
    id: 1,
    nombre: 'Rutina Test',
    ejercicios: [
      {
        id: 1,
        nombre: 'Flexiones',
        repeticiones: null,
        series: null,
        duracion: null,
        imagen: '',
        video: '',
        descripcion: '',
        tieneCorrecion: false,
        categoria: [],
        grupoMuscular: [],
        correccionPremium: false,
        tipoEjercicio: '',
      },
      {
        id: 2,
        nombre: 'Sentadillas',
        repeticiones: null,
        series: null,
        duracion: null,
        imagen: '',
        video: '',
        descripcion: '',
        tieneCorrecion: false,
        categoria: [],
        grupoMuscular: [],
        correccionPremium: false,
        tipoEjercicio: '',
      },
    ],
    duracionEstimada: 2,
    numeroRutina: 0,
    categoriaEjercicio: '',
    rutinasRealizadas: 0,
    caloriasQuemadas: 0,
    numeroDeRutinaSemanal: 0,
    cantidadDeRutinasTotales: 0,
    cantidadDeRutinasPorSemana: 0,
  };

  beforeEach(async () => {
    rutinaServiceSpy = jasmine.createSpyObj('RutinaService', [
      'getDetalleEjercicios',
      'setRutina',
      'setIndiceActual',
      'cargarDesdeSession',
    ]);
    temporizadorServiceSpy = jasmine.createSpyObj('TemporizadorService', [
      'reiniciarTiempo',
      'iniciarTiempo',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    await TestBed.configureTestingModule({
      declarations: [InicioRutinaComponent],
      providers: [
        { provide: RutinaService, useValue: rutinaServiceSpy },
        { provide: TemporizadorService, useValue: temporizadorServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioRutinaComponent);
    component = fixture.componentInstance;
  });

  it('debería cargar la rutina y ejercicios al inicializar', () => {
    rutinaServiceSpy.getDetalleEjercicios.and.returnValue(
      of({ exito: true, mensaje: 'ok', objeto: rutinaMock })
    );

    component.ngOnInit();

    expect(rutinaServiceSpy.cargarDesdeSession).toHaveBeenCalled();
    expect(rutinaServiceSpy.getDetalleEjercicios).toHaveBeenCalledWith(1);
    expect(rutinaServiceSpy.setRutina).toHaveBeenCalledWith(rutinaMock);
    expect(component.rutina).toEqual(rutinaMock);
    expect(component.ejercicios.length).toBe(2);
    expect(component.minutosTraducidos).toBe('≈30 min.');
    expect(component.cargando).toBeFalse();
  });

  it('debería traducir minutos estimados correctamente', () => {
    expect(component.traducirMinutos(1)).toBe('≈15 min.');
    expect(component.traducirMinutos(2)).toBe('≈30 min.');
    expect(component.traducirMinutos(3)).toBe('≈45 min.');
    expect(component.traducirMinutos(99)).toBe('No especificado');
  });

  it('debería iniciar rutina correctamente', () => {
    component.rutina = rutinaMock;

    component.iniciarRutina();

    expect(rutinaServiceSpy.setIndiceActual).toHaveBeenCalledWith(0);
    expect(temporizadorServiceSpy.reiniciarTiempo).toHaveBeenCalled();
    expect(temporizadorServiceSpy.iniciarTiempo).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/informacion-ejercicio']);
  });

  it('no debería iniciar rutina si no hay rutina cargada', () => {
    component.rutina = null;

    component.iniciarRutina();

    expect(rutinaServiceSpy.setIndiceActual).not.toHaveBeenCalled();
    expect(temporizadorServiceSpy.iniciarTiempo).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería cargar rutina desde sesión al inicializar', () => {
    rutinaServiceSpy.getDetalleEjercicios.and.returnValue(
      of({ exito: true, mensaje: 'ok', objeto: rutinaMock })
    );

    component.ngOnInit();

    expect(rutinaServiceSpy.cargarDesdeSession).toHaveBeenCalled();
  });
*/
  /*it('debería manejar errores al obtener la rutina', () => {
    dadoQueRutinaServiceLanzaError();

    cuandoSeInicializaElComponente();

    entoncesSeLogueaElError();
  });*/

  /*function dadoQueRutinaServiceDevuelveRutina() {
    rutinaServiceMock.getDetalleEjercicios.and.returnValue(of(rutinaMock));
  }

  function dadoQueRutinaServiceLanzaError() {
    rutinaServiceMock.getDetalleEjercicios.and.returnValue(
      throwError(() => new Error('Error de red'))
    );
    spyOn(console, 'error');
  }

  function dadoQueHayUnaRutinaCargada() {
    component.rutina = rutinaMock;
  }

  function dadoQueNoHayRutina() {
    component.rutina = null;
  }

  function cuandoSeInicializaElComponente() {
    component.ngOnInit();
  }

  function cuandoSeIniciaLaRutina() {
    component.iniciarRutina();
  }

  function entoncesLaRutinaYLosEjerciciosEstanCargados() {
    expect(component.rutina).toEqual(rutinaMock);
    expect(component.ejercicios.length).toBe(2);
    expect(component.cargando).toBeFalse();
    expect(component.minutosTraducidos).toBe('≈30 min.');
    expect(rutinaServiceMock.setRutina).toHaveBeenCalledWith(rutinaMock);
  }

  function entoncesLaRutinaSeIniciaCorrectamente() {
    expect(rutinaServiceMock.setIndiceActual).toHaveBeenCalledWith(0);
    expect(temporizadorServiceMock.reiniciarTiempo).toHaveBeenCalled();
    expect(temporizadorServiceMock.iniciarTiempo).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/informacion-ejercicio',
    ]);
  }

  function entoncesNoSeDebeIniciarNada() {
    expect(rutinaServiceMock.setIndiceActual).not.toHaveBeenCalled();
    expect(temporizadorServiceMock.iniciarTiempo).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  }

  function entoncesSeLlamaACargarDesdeSesion() {
    expect(rutinaServiceMock.cargarDesdeSession).toHaveBeenCalled();
  }

  function entoncesSeLogueaElError() {
    expect(console.error).toHaveBeenCalledWith(
      'Error al obtener la rutina:',
      jasmine.any(Error)
    );
  }
});*/
