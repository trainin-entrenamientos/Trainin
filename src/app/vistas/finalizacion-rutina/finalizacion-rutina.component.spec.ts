import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FinalizacionRutinaComponent } from './finalizacion-rutina.component';
import { RutinaService } from '../../core/servicios/rutinaServicio/rutina.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';
import { CorreccionDataService } from '../../core/servicios/correccionPosturaServicio/correccion-data.service';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { CompartidoModule } from '../../compartido/compartido.module';
import { ToastrService } from 'ngx-toastr';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';

describe('FinalizacionRutinaComponent', () => {
  let component: FinalizacionRutinaComponent;
  let fixture: ComponentFixture<FinalizacionRutinaComponent>;

  let rutinaServiceMock: any;
  let authServiceMock: any;
  let temporizadorServiceMock: any;
  let correccionDataServiceMock: any;
  let planServiceMock: any;
  let routerMock: any;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeAll(() => {
    const modalMock = jasmine.createSpyObj('Modal', [
      'show',
      'hide',
      'dispose',
    ]);
    const modalConstructor = function () {
      return modalMock;
    };
    modalConstructor.getInstance = jasmine
      .createSpy('getInstance')
      .and.returnValue(modalMock);
    (window as any).bootstrap = { Modal: modalConstructor };
  });

  beforeEach(() => {
    dadoQueSeConfiguranLosMocks();
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);
    const logroSpy = jasmine.createSpyObj('LogroService', ['mostrarLogro']);

    TestBed.configureTestingModule({
      declarations: [FinalizacionRutinaComponent],
      imports: [CompartidoModule],
      providers: [
        { provide: RutinaService, useValue: rutinaServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: TemporizadorService, useValue: temporizadorServiceMock },
        { provide: CorreccionDataService, useValue: correccionDataServiceMock },
        { provide: PlanEntrenamientoService, useValue: planServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: LogroService, useValue: logroSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ],
    }).compileComponents();

    dadoQueSeCreaElComponente();
  });

  it('debería inicializar la rutina y cargar datos en ngOnInit', () => {
    dadoQueSeInicializaElComponente();

    entoncesSeDebeCargarRutinaYDatos();
  });

  it('debería abrir el modal de feedback correctamente', () => {
    dadoQueSeConfiguraModalInstance();

    cuandoSeAbreElModalFeedback();

    entoncesDebeMostrarModal();
  });

  it('debería enviar feedback con opción fácil y navegar a planes', fakeAsync(() => {
    dadoQueSePreparaParaEnviarFeedback('facil');

    cuandoSeEnviaFeedback();

    tick();

    entoncesDebeActualizarNivelExigenciaConNivel(1);
    entoncesDebeOcultarModal();
  }));

  it('debería enviar feedback con opción difícil y navegar a planes', fakeAsync(() => {
    dadoQueSeInicializaElComponente();
    dadoQueSePreparaParaEnviarFeedback('dificil');

    cuandoSeEnviaFeedback();

    tick();

    entoncesDebeActualizarNivelExigenciaConNivel(2);
    entoncesDebeOcultarModal();
    entoncesDebeNavegarAPlanes();
  }));

  it('debería mostrar error si no se selecciona opción al enviar feedback', () => {
    component.opcionSeleccionada = '';
    component.selectedSidebarIndex = null;
    component.opcionSeleccionadaEstadisticas = null;

    component.enviarFeedback();

    expect(toastrSpy.error)
      .toHaveBeenCalledWith('Por favor, selecciona una opción.');
  });

  it('debería seleccionarse una opcion en el sidebar', () => {
    dadoQueNoHayOpcionSeleccionada();

    cuandoSeleccionoOpcionSidebar(1);

    entoncesOpcionSidebarSeleccionada(1);

    cuandoSeleccionoOpcionSidebar(1);

    entoncesOpcionSidebarNoSeleccionada();

    cuandoSeleccionoOpcionSidebar(0);

    entoncesOpcionSidebarSeleccionada(0);
  });

  it('debería mostrarse la opcion seleccionada', () => {
    dadoQueNoHayOpcionSeleccionadaEstadisticas();

    cuandoMuestroOpcion('estadisticas');

    entoncesOpcionSeleccionadaEstadisticasEs('estadisticas');

    cuandoCierroOpcion();

    entoncesOpcionSeleccionadaEstadisticasEsNull();
  });

  it('se debería reiniciar el temporizador al finalizar la rutina', fakeAsync(() => {
    dadoQueSePreparaParaEnviarFeedback('facil');

    cuandoSeEnviaFeedback();

    tick();

    entoncesTemporizadorReiniciado();
  }));

  it('se debería reiniciar la rutina al finalizar la rutina', fakeAsync(() => {
    dadoQueSePreparaParaEnviarFeedback('facil');

    cuandoSeEnviaFeedback();

    tick();

    entoncesRutinaReiniciada();
  }));

  it('debería redirigir y mostrar error si falla actualizarNivelExigencia', fakeAsync(() => {
    component.opcionSeleccionada = 'facil';
    component.rutina = { idPlan: 7 };
    component.email = 'trainin@trainin.com';
    toastrSpy.error.calls.reset();
    routerMock.navigate.calls.reset();

    planServiceMock.actualizarNivelExigencia
      .and.returnValue(throwError(() => new Error('Error al actualizar el nivel de exigencia')));

    component.enviarFeedback();
    tick();

    expect(toastrSpy.error)
      .toHaveBeenCalledWith('No se pudo enviar el feedback correctamente');
    expect(routerMock.navigate)
      .toHaveBeenCalledWith(['/finalizacion-rutina']);
  }));

  function dadoQueSeConfiguranLosMocks() {
    rutinaServiceMock = {
      cargarDesdeSession: jasmine
        .createSpy('cargarDesdeSession')
        .and.returnValue({
          id: 1,
          ejercicios: [{ grupoMuscular: ['pecho', 'biceps'] }],
        }),
      getDatosIniciales: jasmine
        .createSpy('getDatosIniciales')
        .and.returnValue({
          rutina: {
            id: 1,
            ejercicios: [{ grupoMuscular: ['pecho', 'biceps'] }],
            caloriasQuemadas: 100,
          },
          caloriasQuemadas: 100,
        }),
      fueRealizada: jasmine.createSpy('fueRealizada').and.returnValue(of({})),
      limpiarRutina: jasmine.createSpy('limpiarRutina'),
      buscarNombreEjercicio: jasmine
        .createSpy('buscarNombreEjercicio')
        .and.callFake((nombre: string) => nombre),
    };

    authServiceMock = {
      getEmail: jasmine.createSpy('getEmail').and.returnValue('trainin@trainin.com'),
    };

    temporizadorServiceMock = {
      pausar: jasmine.createSpy('pausar'),
      obtenerSegundosTranscurridos: jasmine
        .createSpy('obtenerSegundosTranscurridos')
        .and.returnValue(120),
      formatearTiempo: jasmine
        .createSpy('formatearTiempo')
        .and.returnValue('02:00'),
      reiniciarTiempo: jasmine.createSpy('reiniciarTiempo'),
    };

    correccionDataServiceMock = {
      obtenerTodos: jasmine.createSpy('obtenerTodos').and.returnValue([]),
      limpiarDatos: jasmine.createSpy('limpiarDatos'),
    };

    planServiceMock = {
      actualizarNivelExigencia: jasmine
        .createSpy('actualizarNivelExigencia')
        .and.returnValue(of('ok')),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };
  }

  function dadoQueSeCreaElComponente() {
    fixture = TestBed.createComponent(FinalizacionRutinaComponent);
    component = fixture.componentInstance;
  }

  function dadoQueSeInicializaElComponente() {
    component.ngOnInit();
  }

  function dadoQueSeConfiguraModalInstance() {
    component.modalInstance = jasmine.createSpyObj('modalInstance', [
      'show',
      'hide',
    ]);
  }

  function dadoQueSePreparaParaEnviarFeedback(opcion: string) {
    component.opcionSeleccionada = opcion;
    component.rutina = { id: 1, idPlan: 123 };
    component.email = 'trainin@trainin.com';
    dadoQueSeConfiguraModalInstance();
  }

  function dadoQueNoHayOpcionSeleccionada() {
    component.opcionSeleccionada = '';
    component.selectedSidebarIndex = null;
    component.opcionSeleccionadaEstadisticas = null;

    component.enviarFeedback();

    expect(toastrSpy.error).toHaveBeenCalledWith('Por favor, selecciona una opción.');
  }

  function dadoQueNoHayOpcionSeleccionadaEstadisticas() {
    component.opcionSeleccionadaEstadisticas = null;
  }

  function cuandoSeAbreElModalFeedback() {
    const modalElement = document.createElement('div');
    modalElement.id = 'feedbackModal';
    document.body.appendChild(modalElement);

    component.abrirModalFeedback();

    document.body.removeChild(modalElement);
  }

  function cuandoSeEnviaFeedback() {
    component.enviarFeedback();
  }

  function cuandoSeleccionoOpcionSidebar(indice: number) {
    component.opcionSeleccionadaSidebar(indice);
  }

  function cuandoMuestroOpcion(opcion: string) {
    component.mostrarOpcion(opcion);
  }

  function cuandoCierroOpcion() {
    component.cerrarOpcion();
  }

  function entoncesSeDebeCargarRutinaYDatos() {
    expect(rutinaServiceMock.cargarDesdeSession).toHaveBeenCalled();
    expect(component.ejercicios.length).toBeGreaterThan(0);
    expect(component.email).toBe('trainin@trainin.com');
    expect(temporizadorServiceMock.pausar).toHaveBeenCalled();
    expect(component.tiempoTotal).toBe('02:00');
  }

  function entoncesDebeMostrarModal() {
    expect((window as any).bootstrap.Modal.getInstance).toHaveBeenCalled();
    expect(component.modalInstance.show).toHaveBeenCalled();
  }

  function entoncesDebeActualizarNivelExigenciaConNivel(nivelEsperado: number) {
    expect(planServiceMock.actualizarNivelExigencia).toHaveBeenCalledWith(
      123,
      jasmine.objectContaining({ nivelExigencia: nivelEsperado })
    );
  }

  function entoncesDebeOcultarModal() {
    expect(
      (window as any).bootstrap.Modal.getInstance().hide
    ).toHaveBeenCalled();
  }

  function entoncesDebeNavegarAPlanes() {
    expect(routerMock.navigate).toHaveBeenCalledWith(['/planes']);
  }

  function entoncesOpcionSidebarSeleccionada(indice: number) {
    expect(component.selectedSidebarIndex).toBe(indice);
    expect(component.expandido).toBeTrue();
  }

  function entoncesOpcionSidebarNoSeleccionada() {
    expect(component.selectedSidebarIndex).toBeNull();
    expect(component.expandido).toBeFalse();
  }

  function entoncesOpcionSeleccionadaEstadisticasEs(valor: string) {
    expect(component.opcionSeleccionadaEstadisticas).toBe(valor);
  }

  function entoncesOpcionSeleccionadaEstadisticasEsNull() {
    expect(component.opcionSeleccionadaEstadisticas).toBeNull();
  }

  function entoncesTemporizadorReiniciado() {
    expect(temporizadorServiceMock.reiniciarTiempo).toHaveBeenCalled();
  }

  function entoncesRutinaReiniciada() {
    expect(component.rutina).toBeNull();
    expect(rutinaServiceMock.limpiarRutina).toHaveBeenCalled();
    expect(correccionDataServiceMock.limpiarDatos).toHaveBeenCalled();
  }
});