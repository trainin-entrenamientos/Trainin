import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PlanesComponent } from './planes.component';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { EjercicioService } from '../../core/servicios/EjercicioServicio/ejercicio.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PlanesComponent', () => {
  let component: PlanesComponent;
  let fixture: ComponentFixture<PlanesComponent>;
  let mockPlanService: any;
  let mockUsuarioService: any;
  let mockAuthService: any;
  let mockEjercicioService: any;
  let mockToastr: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockPlanService = jasmine.createSpyObj([
      'getPlanesDeEntrenamiento',
      'desactivarPlanPorId',
    ]);
    mockUsuarioService = jasmine.createSpyObj(['obtenerUsuarioPorEmail']);
    mockAuthService = jasmine.createSpyObj(['getEmail', 'loginWithSpotify']);
    mockEjercicioService = jasmine.createSpyObj(['obtenerEjercicioDiario']);
    mockToastr = jasmine.createSpyObj(['error', 'warning']);
    mockRouter = jasmine.createSpyObj(['navigate']);

    await TestBed.configureTestingModule({
      declarations: [PlanesComponent],
      providers: [
        { provide: PlanEntrenamientoService, useValue: mockPlanService },
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: EjercicioService, useValue: mockEjercicioService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanesComponent);
    component = fixture.componentInstance;
  });

  it('debería llamar a obtenerUsuario en ngOnInit', () => {
    const spy = spyOn(component, 'obtenerUsuario');
    mockAuthService.getEmail.and.returnValue('facu@gmail.com');

    mockEjercicioService.obtenerEjercicioDiario.and.returnValue(
      of({ objeto: null })
    );

    component.ngOnInit();

    expect(component.email).toBe('facu@gmail.com');
    expect(spy).toHaveBeenCalled();
  });

  it('debería obtener usuario y luego los planes', () => {
    mockUsuarioService.obtenerUsuarioPorEmail.and.returnValue(
      of({ objeto: { id: 1 } })
    );
    const obtenerPlanSpy = spyOn(component, 'obtenerPlanEntrenamiento');

    component.email = 'facu@gmail.com';
    component.obtenerUsuario();

    expect(component.usuario?.id).toBe(1);
    expect(component.idUsuario).toBe(1);
    expect(obtenerPlanSpy).toHaveBeenCalledWith(1);
  });

  it('debería manejar error si falla obtenerUsuario', () => {
    mockUsuarioService.obtenerUsuarioPorEmail.and.returnValue(
      throwError(() => new Error('error'))
    );

    component.email = 'facu@gmail.com';
    component.obtenerUsuario();

    expect(mockToastr.error).toHaveBeenCalledWith(
      'No se pudo obtener al usuario'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/inicio']);
  });

  it('debería obtener los planes correctamente', fakeAsync(() => {
    const planes = { objeto: [{ id: 1 }, { id: 2 }] };
    mockPlanService.getPlanesDeEntrenamiento.and.returnValue(of(planes));

    component.obtenerPlanEntrenamiento(1);
    tick(500);

    expect(component.planEntrenamiento.length).toBe(2);
    expect(component.cargando).toBeFalse();
  }));

  it('debería manejar error si falla obtenerPlanEntrenamiento', () => {
    mockPlanService.getPlanesDeEntrenamiento.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.obtenerPlanEntrenamiento(1);

    expect(mockToastr.error).toHaveBeenCalledWith(
      'Error al obtener los planes de entrenamiento'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/inicio']);
  });

  it('debería marcar como disponible el ejercicio diario si existe', () => {
    const mockResponse = { objeto: { nombre: 'Abdominales' } };
    mockEjercicioService.obtenerEjercicioDiario.and.returnValue(
      of(mockResponse)
    );

    component.email = 'facu@gmail.com';
    component.verificarDisponibilidadDeEjercicioDiario();

    expect(component.EjercicioDiarioDisponible).toBeTrue();
    expect(component.nombreEjercicioDiario).toBe('Abdominales');
  });

  it('debería marcar como no disponible si no hay ejercicio diario', () => {
    mockEjercicioService.obtenerEjercicioDiario.and.returnValue(
      of({ objeto: null })
    );

    component.email = 'facu@gmail.com';
    component.verificarDisponibilidadDeEjercicioDiario();

    expect(component.EjercicioDiarioDisponible).toBeFalse();
    expect(component.nombreEjercicioDiario).toBe('');
  });

  it('debería manejar error al verificar ejercicio diario', () => {
    mockEjercicioService.obtenerEjercicioDiario.and.returnValue(
      throwError(() => new Error('error'))
    );

    component.email = 'facu@gmail.com';
    component.verificarDisponibilidadDeEjercicioDiario();

    expect(component.EjercicioDiarioDisponible).toBeFalse();
  });

  it('debería desactivar el plan y recargar los planes', () => {
    mockPlanService.desactivarPlanPorId.and.returnValue(of({}));
    const obtenerSpy = spyOn(component, 'obtenerPlanEntrenamiento');

    component.idUsuario = 1;
    component.desactivarPlan(99);

    expect(mockPlanService.desactivarPlanPorId).toHaveBeenCalledWith(99, 1);
    expect(obtenerSpy).toHaveBeenCalledWith(1);
  });

  it('debería manejar error al desactivar plan', () => {
    mockPlanService.desactivarPlanPorId.and.returnValue(
      throwError(() => new Error('error'))
    );

    component.desactivarPlan(99);

    expect(mockToastr.error).toHaveBeenCalledWith(
      'Error al desactivar el plan'
    );
  });

  it('debería llamar a login con Spotify', () => {
    component.iniciarSesionConSpotify();
    expect(mockAuthService.loginWithSpotify).toHaveBeenCalled();
  });

  it('debería redirigir correctamente según estado del plan', () => {
    component.irAlPlan(123, 'Realizada hoy');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/detalle-plan', 123]);

    component.irAlPlan(456, 'Pendiente');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/inicio-rutina', 456]);
  });

  it('debería calcular correctamente el porcentaje de progreso', () => {
    const plan = { cantidadRutinasHechas: 3, cantidadRutinas: 4 };
    const resultado = component.calcularPorcentajeProgreso(plan);
    expect(resultado).toBe('75.00%');
  });

  it('debería devolver "0%" si el plan es null', () => {
    const resultado = component.calcularPorcentajeProgreso(null);
    expect(resultado).toBe('0%');
  });

  it('debería devolver "0%" si cantidadRutinas es 0 o undefined', () => {
    const plan = { cantidadRutinasHechas: 0 };
    const resultado = component.calcularPorcentajeProgreso(plan);
    expect(resultado).toBe('0.00%');
  });

  it('debería establecer el ID del plan a eliminar y mostrar el modal', () => {
    component.confirmarEliminacion(10);
    expect(component.planAEliminarId).toBe(10);
    expect(component.mostrarModal).toBeTrue();
  });

  it('debería cancelar la eliminación y ocultar el modal', () => {
    component.planAEliminarId = 5;
    component.mostrarModal = true;

    component.cancelarEliminacion();

    expect(component.planAEliminarId).toBeNull();
    expect(component.mostrarModal).toBeFalse();
  });

  it('debería desactivar el plan si hay un plan a eliminar', () => {
    const spy = spyOn(component, 'desactivarPlan');
    component.planAEliminarId = 22;
    component.mostrarModal = true;

    component.eliminarPlanConfirmado();

    expect(spy).toHaveBeenCalledWith(22);
    expect(component.planAEliminarId).toBeNull();
    expect(component.mostrarModal).toBeFalse();
  });

  it('no debería llamar a desactivarPlan si planAEliminarId es null', () => {
    const spy = spyOn(component, 'desactivarPlan');
    component.planAEliminarId = null;
    component.mostrarModal = true;

    component.eliminarPlanConfirmado();

    expect(spy).not.toHaveBeenCalled();
    expect(component.mostrarModal).toBeFalse();
  });

  it('debería actualizar pantallaChica según el tamaño de la ventana', () => {
    const mockEvent = { target: { innerWidth: 1000 } };
    component.onResize(mockEvent);
    expect(component.pantallaChica).toBeTrue();

    const mockEventGrande = { target: { innerWidth: 1200 } };
    component.onResize(mockEventGrande);
    expect(component.pantallaChica).toBeFalse();
  });
});
