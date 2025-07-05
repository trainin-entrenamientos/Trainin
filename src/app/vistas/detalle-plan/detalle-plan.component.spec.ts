import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallePlanComponent } from './detalle-plan.component';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

const mockPlan = {
  exito: true,
  mensaje: 'OK',
  objeto: {
    id: 99,
    nombrePlan: 'Plan Prueba',
    tiempoEstimadoPlanMinutos: 100,
    semanasPlan: 1,
    diasPorSemanaPlan: 1,
    descripcionEstadoPlan: 'Activo',
    semanaRutinas: [
      {
        numeroSemana: 1,
        rutinas: [
          {
            id: 1,
            numeroRutina: 1,
            duracionEstimada: 30,
            idPlan: 99,
            ejercicios: [],
            estadoRutina: 1,
          },
        ],
      },
    ],
  },
};

describe('DetallePlanComponent', () => {
  let component: DetallePlanComponent;
  let fixture: ComponentFixture<DetallePlanComponent>;
  let mockPlanService: jasmine.SpyObj<PlanEntrenamientoService>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockActivatedRoute: any;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockPlanService = jasmine.createSpyObj('PlanEntrenamientoService', [
      'obtenerDetallePlan',
    ]);
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', [
      'obtenerUsuarioPorEmail',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getEmail']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    toastr = jasmine.createSpyObj('ToastrService', ['error']);
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
        { provide: Router, useValue: router },
        { provide: ToastrService, useValue: toastr },
      ],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallePlanComponent);
    component = fixture.componentInstance;
  });

  it('debe obtener el email y llamar a obtenerUsuario correctamente', () => {
    const email = 'facu@gmail.com';
    const planId = 5;

    mockAuthService.getEmail.and.returnValue(email);
    spyOn(mockActivatedRoute.snapshot.paramMap, 'get').and.returnValue(
      String(planId)
    );
    const spyObtenerUsuario = spyOn(component, 'obtenerUsuario');

    component.ngOnInit();

    expect(component.email).toBe(email);
    expect(spyObtenerUsuario).toHaveBeenCalledOnceWith(planId);
  });

  it('no debe llamar a usuarioService si el email es null', () => {
    component.email = null;

    component.obtenerUsuario(1);

    expect(mockUsuarioService.obtenerUsuarioPorEmail).not.toHaveBeenCalled();
  });

  it('debe manejar error si obtenerUsuarioPorEmail falla', () => {
    component.email = 'facu@gmail.com';
    mockUsuarioService.obtenerUsuarioPorEmail.and.returnValue(
      throwError(() => new Error('Error de red'))
    );

    component.obtenerUsuario(1);

    expect(toastr.error).toHaveBeenCalledWith('No se pudo obtener al usuario');
    expect(router.navigate).toHaveBeenCalledWith(['/inicio']);
    expect(component.cargando).toBeFalse();
  });

  it('debe cargar el detalle del plan correctamente y setear estados', () => {
    mockPlanService.obtenerDetallePlan.and.returnValue(of(mockPlan));

    const spySeleccionar = spyOn(component, 'seleccionarPrimerRutinaActiva');

    component.idUsuario = 10;
    component.obtenerDetalleDelPlan(99);

    expect(component.detallePlan?.id).toBe(99);
    expect(component.semanas.length).toBe(1);
    expect(component.semanas[0].rutinas[0].estadoRutina).toBe(1);
    expect(spySeleccionar).toHaveBeenCalled();
    expect(component.cargando).toBeFalse();
  });

  it('debe manejar el error si falla obtenerDetalleDelPlan', () => {
    mockPlanService.obtenerDetallePlan.and.returnValue(
      throwError(() => new Error('fallo'))
    );
    component.obtenerDetalleDelPlan(123);

    expect(toastr.error).toHaveBeenCalledWith(
      'No se pudo obtener el detalle del plan'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/planes']);
  });

  it('debe seleccionar la primera rutina activa', () => {
    component.semanas = [
      {
        rutinas: [
          { estadoRutina: 3, estado: 3 },
          { estadoRutina: 1, estado: 1 },
        ],
      },
    ];

    component.seleccionarPrimerRutinaActiva();

    expect(component.semanaActual).toBe(0);
    expect(component.diaActivo).toBe(1);
  });

  it('debe setear semanaActual y diaActivo a 0 si no hay rutina activa', () => {
    component.semanas = [
      {
        rutinas: [{ estadoRutina: 3 }, { estadoRutina: 2 }],
      },
    ];

    component.seleccionarPrimerRutinaActiva();

    expect(component.semanaActual).toBe(0);
    expect(component.diaActivo).toBe(0);
  });

  it('debe cambiar de semana correctamente', () => {
    component.semanas = [1, 2, 3];
    component.semanaActual = 1;

    component.cambiarSemana(1);

    expect(component.semanaActual).toBe(2);
    expect(component.diaActivo).toBe(0);
  });

  it('no debe cambiar de semana si el índice es inválido', () => {
    component.semanas = [1, 2, 3];
    component.semanaActual = 2;

    component.cambiarSemana(1);

    expect(component.semanaActual).toBe(2);
  });

  it('debe cambiar el día activo al índice recibido', () => {
    component.diaActivo = 0;

    component.seleccionarDia(2);

    expect(component.diaActivo).toBe(2);
  });

  it('debe redirigir si detallePlan existe', () => {
    component.detallePlan = { id: 42 } as any;

    component.redirigir();
    expect(router.navigate).toHaveBeenCalledWith(['/inicio-rutina', 42]);
  });

  it('debe mostrar error si detallePlan no está definido', () => {
    component.detallePlan = undefined;

    component.redirigir();

    expect(toastr.error).toHaveBeenCalledWith(
      'El detalle del plan no está definido'
    );
  });

  it('debe retornar la semana actual', () => {
    component.semanas = [{ rutinas: [] }];
    component.semanaActual = 0;

    expect(component.semanaSeleccionada).toEqual({ rutinas: [] });
  });

  it('debe retornar undefined si semanaActual está fuera de rango', () => {
    component.semanas = [];
    component.semanaActual = 1;

    expect(component.semanaSeleccionada).toBeUndefined();
  });

  it('debe retornar los días de la semana seleccionada', () => {
    component.semanas = [{ rutinas: [{ id: 1 }, { id: 2 }] }];
    component.semanaActual = 0;

    expect(component.diasSemanaActual.length).toBe(2);
  });

  it('debe retornar array vacío si no hay semana seleccionada', () => {
    component.semanas = [];
    component.semanaActual = 0;

    expect(component.diasSemanaActual).toEqual([]);
  });

  it('debe retornar la rutina actual correctamente', () => {
    component.semanas = [{ rutinas: [{ id: 1 }, { id: 2 }] }];
    component.semanaActual = 0;
    component.diaActivo = 1;

    expect(component.rutinaActual?.id).toBe(2);
  });

  it('debe retornar undefined si no hay rutina en el día activo', () => {
    component.semanas = [{ rutinas: [] }];
    component.semanaActual = 0;
    component.diaActivo = 0;

    expect(component.rutinaActual).toBeUndefined();
  });

  it('debe retornar los ejercicios del día actual', () => {
    component.semanas = [
      { rutinas: [{ ejercicios: [{ nombre: 'Sentadillas' }] }] },
    ];
    component.semanaActual = 0;
    component.diaActivo = 0;

    expect(component.ejerciciosDelDia.length).toBe(1);
  });

  it('debe retornar array vacío si no hay rutina o ejercicios', () => {
    component.semanas = [{ rutinas: [{}] }];
    component.semanaActual = 0;
    component.diaActivo = 0;

    expect(component.ejerciciosDelDia).toEqual([]);
  });

  it('debe retornar la primera rutina activa (estado 1)', () => {
    component.semanas = [
      {
        rutinas: [
          { estadoRutina: 3, estado: 3 } as any,
          { estadoRutina: 1, estado: 1, id: 7 } as any,
        ],
      },
    ];

    const rutina = component.getPrimerRutinaActiva();

    expect(rutina?.estadoRutina).toBe(1);
    expect(rutina?.id).toBe(7);
  });

  it('debe retornar null si no hay rutina activa', () => {
    component.semanas = [{ rutinas: [{ estadoRutina: 2 }] }];

    expect(component.getPrimerRutinaActiva()).toBeNull();
  });

  it('debe retornar true si la rutina actual es la primera activa', () => {
    component.semanas = [{ rutinas: [{ id: 5, estadoRutina: 1, estado: 1 }] }];
    component.semanaActual = 0;
    component.diaActivo = 0;

    expect(component.esPrimeraRutinaActivaActual()).toBeTrue();
  });

  it('debe retornar false si la rutina actual no es la primera activa', () => {
    component.semanas = [
      {
        rutinas: [
          { id: 5, estadoRutina: 2 },
          { id: 6, estadoRutina: 1 },
        ],
      },
    ];
    component.semanaActual = 0;
    component.diaActivo = 0;

    expect(component.esPrimeraRutinaActivaActual()).toBeFalse();
  });

  it('debe traducir correctamente los estados de rutina', () => {
    expect(component.traducirEstadoRutina(1)).toBe('Activo');
    expect(component.traducirEstadoRutina(2)).toBe('Completado');
    expect(component.traducirEstadoRutina(3)).toBe('Pendiente');
    expect(component.traducirEstadoRutina(4)).toBe('Inactivo');
    expect(component.traducirEstadoRutina(999)).toBe('Desconocido');
  });
});
