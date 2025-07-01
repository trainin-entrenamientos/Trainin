/*import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioRutinaComponent } from './inicio-rutina.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RutinaService } from '../../core/servicios/rutinaServicio/rutina.service';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';
import { Rutina } from '../../core/modelos/RutinaDTO';

describe('InicioRutinaComponent', () => {
  let component: InicioRutinaComponent;
  let fixture: ComponentFixture<InicioRutinaComponent>;
  let rutinaServiceMock: jasmine.SpyObj<RutinaService>;
  let temporizadorServiceMock: jasmine.SpyObj<TemporizadorService>;
  let routerMock: jasmine.SpyObj<Router>;

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
  };

  beforeEach(async () => {
    rutinaServiceMock = jasmine.createSpyObj('RutinaService', [
      'getDetalleEjercicios',
      'setRutina',
      'setIndiceActual',
      'cargarDesdeSession',
    ]);
    temporizadorServiceMock = jasmine.createSpyObj('TemporizadorService', [
      'reiniciarTiempo',
      'iniciarTiempo',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [InicioRutinaComponent],
      providers: [
        { provide: RutinaService, useValue: rutinaServiceMock },
        { provide: TemporizadorService, useValue: temporizadorServiceMock },
        { provide: Router, useValue: routerMock },
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
    dadoQueRutinaServiceDevuelveRutina();

    cuandoSeInicializaElComponente();

    entoncesLaRutinaYLosEjerciciosEstanCargados();
  });

  it('debería traducir minutos estimados correctamente', () => {
    const traduccionesEsperadas = {
      1: '≈15 min.',
      2: '≈30 min.',
      3: '≈45 min.',
      99: 'No especificado',
    };

    for (const [min, texto] of Object.entries(traduccionesEsperadas)) {
      expect(component.traducirMinutos(+min)).toBe(texto);
    }
  });

  it('debería iniciar rutina correctamente', () => {
    dadoQueHayUnaRutinaCargada();

    cuandoSeIniciaLaRutina();

    entoncesLaRutinaSeIniciaCorrectamente();
  });

  it('no debería iniciar rutina si no hay rutina cargada', () => {
    dadoQueNoHayRutina();

    cuandoSeIniciaLaRutina();

    entoncesNoSeDebeIniciarNada();
  });

  it('debería cargar rutina desde sesión al inicializar', () => {
    dadoQueRutinaServiceDevuelveRutina();

    cuandoSeInicializaElComponente();

    entoncesSeLlamaACargarDesdeSesion();
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