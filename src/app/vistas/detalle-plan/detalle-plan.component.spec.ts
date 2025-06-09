import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallePlanComponent } from './detalle-plan.component';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('DetallePlanComponent', () => {
  let component: DetallePlanComponent;
  let fixture: ComponentFixture<DetallePlanComponent>;
  let mockPlanService: jasmine.SpyObj<PlanEntrenamientoService>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockPlanService = jasmine.createSpyObj('PlanEntrenamientoService', [
      'obtenerDetallePlan',
    ]);
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', [
      'obtenerUsuarioPorId',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getEmail']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => '123',
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [DetallePlanComponent],
      providers: [
        { provide: PlanEntrenamientoService, useValue: mockPlanService },
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallePlanComponent);
    component = fixture.componentInstance;
  });

  it('debería obtener el email, usuario y detalle del plan al inicializarse', () => {
    dadoQueElUsuarioTieneEmail();
    dadoQueElUsuarioEsDevueltoConID(99);
    dadoQueElPlanEsDevueltoConSemanas();

    cuandoSeEjecutaOnInit();

    entoncesElIDDelUsuarioDebeSer(99);
    entoncesDebeHaberseCargadoElPlan();
  });

  it('debería cambiar de semana y resetear día activo', () => {
    dadoQueElUsuarioTieneEmail();
    dadoQueElUsuarioEsDevueltoConID(1);
    dadoQueElPlanEsDevueltoConSemanas();

    cuandoSeEjecutaOnInit();

    component.cambiarSemana(1);

    expect(component.semanaActual).toBe(1);
    expect(component.diaActivo).toBe(0);
  });

  it('debería traducir estado correctamente', () => {
    expect(component.traducirEstadoRutina(1)).toBe('Activo');
    expect(component.traducirEstadoRutina(2)).toBe('Completado');
    expect(component.traducirEstadoRutina(3)).toBe('Pendiente');
    expect(component.traducirEstadoRutina(4)).toBe('Inactivo');
    expect(component.traducirEstadoRutina(99)).toBe('Desconocido');
  });

  it('debería devolver la primera rutina activa', () => {
    component.semanas = [
      {
        rutinas: [
          { id: 10, estado: 2 },
          { id: 11, estado: 1 },
        ],
      },
      {
        rutinas: [{ id: 12, estado: 1 }],
      },
    ];

    const rutina = component.getPrimerRutinaActiva();
    expect(rutina?.id).toBe(11);
  });

  it('debería verificar si la rutina actual es la primera activa', () => {
    component.semanas = [
      {
        rutinas: [
          { id: 1, estado: 1, ejercicios: [] },
          { id: 2, estado: 2, ejercicios: [] },
        ],
      },
    ];
    component.semanaActual = 0;
    component.diaActivo = 0;

    expect(component.esPrimeraRutinaActivaActual()).toBeTrue();
  });

  it('no debe intentar obtener usuario si el email es null', () => {
    mockAuthService.getEmail.and.returnValue(null);

    component.ngOnInit();

    expect(mockUsuarioService.obtenerUsuarioPorId).not.toHaveBeenCalled();
    expect(component.cargando).toBeTrue();
  });

  it('debe manejar el error si falla obtenerUsuarioPorId', () => {
    dadoQueElUsuarioTieneEmail();
    mockUsuarioService.obtenerUsuarioPorId.and.returnValue(
      throwError(() => new Error('Fallo al obtener usuario'))
    );

    component.ngOnInit();

    expect(component.cargando).toBeFalse();
  });

  it('debe manejar el error si falla obtenerDetalleDelPlan', () => {
    dadoQueElUsuarioTieneEmail();
    dadoQueElUsuarioEsDevueltoConID(1);
    mockPlanService.obtenerDetallePlan.and.returnValue(
      throwError(() => new Error('Error al obtener plan'))
    );

    component.ngOnInit();

    expect(component.cargando).toBeTrue();
  });

  it('no debe cambiar semana si el índice es inválido', () => {
    dadoQueElUsuarioTieneEmail();
    dadoQueElUsuarioEsDevueltoConID(1);
    dadoQueElPlanEsDevueltoConSemanas();
    component.ngOnInit();

    const semanaOriginal = component.semanaActual;

    component.cambiarSemana(-1);
    expect(component.semanaActual).toBe(semanaOriginal);

    component.cambiarSemana(99);
    expect(component.semanaActual).toBe(semanaOriginal);
  });

  it('getPrimerRutinaActiva debe devolver null si no hay rutinas activas', () => {
    component.semanas = [
      {
        rutinas: [
          { id: 1, estado: 2 },
          { id: 2, estado: 3 },
        ],
      },
    ];

    expect(component.getPrimerRutinaActiva()).toBeNull();
  });

  it('esPrimeraRutinaActivaActual debe devolver false si no es la rutina activa', () => {
    component.semanas = [
      {
        rutinas: [
          { id: 1, estado: 2, ejercicios: [] },
          { id: 2, estado: 1, ejercicios: [] },
        ],
      },
    ];
    component.semanaActual = 0;
    component.diaActivo = 0;

    expect(component.esPrimeraRutinaActivaActual()).toBeFalse();
  });

  function dadoQueElUsuarioTieneEmail() {
    mockAuthService.getEmail.and.returnValue('test@correo.com');
  }

  function dadoQueElUsuarioEsDevueltoConID(id: number) {
    mockUsuarioService.obtenerUsuarioPorId.and.returnValue(of({ id }));
  }

  function dadoQueElPlanEsDevueltoConSemanas() {
    const planMock = {
      semanaRutinas: [
        {
          rutinas: [
            { id: 1, estado: 1, ejercicios: ['ej1', 'ej2'] },
            { id: 2, estado: 2, ejercicios: ['ej3'] },
          ],
        },
        {
          rutinas: [{ id: 3, estado: 3, ejercicios: ['ej4'] }],
        },
      ],
    };
    mockPlanService.obtenerDetallePlan.and.returnValue(of(planMock));
  }

  function cuandoSeEjecutaOnInit() {
    component.ngOnInit();
  }

  function entoncesElIDDelUsuarioDebeSer(id: number) {
    expect(component.idUsuario).toBe(id);
  }

  function entoncesDebeHaberseCargadoElPlan() {
    expect(component.detallePlan).toBeDefined();
    expect(component.semanas.length).toBe(2);
    expect(component.cargando).toBeFalse();
  }
});
