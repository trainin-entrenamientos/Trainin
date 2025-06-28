import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HistorialPlanesComponent } from './historial-planes.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';


describe('HistorialPlanesComponent', () => {
  let component: HistorialPlanesComponent;
  let fixture: ComponentFixture<HistorialPlanesComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let planServiceSpy: jasmine.SpyObj<PlanEntrenamientoService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getEmail']);
    planServiceSpy = jasmine.createSpyObj('PlanEntrenamientoService', ['obtenerHistorialPlanes']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    await TestBed.configureTestingModule({
      declarations: [HistorialPlanesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],  
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PlanEntrenamientoService, useValue: planServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialPlanesComponent);
    component = fixture.componentInstance;
  });

 

  it('debería obtener el email y llamar a obtenerHistorialPlanes en ngOnInit', fakeAsync(() => {
    const emailMock = 'facu@gmail.com';
    authServiceSpy.getEmail.and.returnValue(emailMock);

    const planesMock = [
      { id: 1, tipoEntrenamiento: 'Cardio', foto: '', calorias: 100, tiempo: 1200, fechaRealizacion: new Date() }
    ];
        planServiceSpy.obtenerHistorialPlanes.and.returnValue(of({
        exito: true,
        mensaje: 'OK',
        objeto: planesMock
        }));

    fixture.detectChanges();

    tick();
    expect(authServiceSpy.getEmail).toHaveBeenCalled();
    expect(planServiceSpy.obtenerHistorialPlanes).toHaveBeenCalledWith(emailMock);

    expect(component.planesHistorial).toEqual(planesMock);
    expect(component.cargando).toBeFalse();
    expect(component.tienePlanes).toBeTrue();
  }));

  it('debería setear tienePlanes en false si no hay planes', fakeAsync(() => {
    authServiceSpy.getEmail.and.returnValue('facu@gmail.com');
        planServiceSpy.obtenerHistorialPlanes.and.returnValue(of({
        exito: true,
        mensaje: 'OK',
        objeto: []
        }));

    fixture.detectChanges();
    tick();

    expect(component.tienePlanes).toBeFalse();
  }));

  it('debería llamar manejarErrorYRedirigir si no hay email', () => {
    authServiceSpy.getEmail.and.returnValue(null);

    component.ngOnInit();

       expect(toastrSpy.error).toHaveBeenCalledWith('No se pudo obtener el email del usuario');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
  });

  it('debería llamar manejarErrorYRedirigir si el servicio devuelve error', fakeAsync(() => {
    const emailMock = 'facu@gmail.com';
    authServiceSpy.getEmail.and.returnValue(emailMock);
    planServiceSpy.obtenerHistorialPlanes.and.returnValue(throwError(() => new Error('Error de red')));

    component.ngOnInit();
    tick();

   expect(toastrSpy.error).toHaveBeenCalledWith('No se obtuvo el historial de planes');
   expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);

  }));

  it('irAlDetalle debería navegar a la ruta correcta', () => {
    const idPlan = 123;
    component.irAlDetalle(idPlan);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/detalle-plan', idPlan]);
  });

  it('formatearTiempo debería formatear correctamente segundos en hh:mm:ss y mm:ss', () => {
    expect(component.formatearTiempo(3661)).toBe('01:01:01'); 
    expect(component.formatearTiempo(59)).toBe('00:59');    
    expect(component.formatearTiempo(125)).toBe('02:05');    
    expect(component.formatearTiempo(3600)).toBe('01:00:00'); 
  });

  it('debería setear cargando en false al finalizar la carga', fakeAsync(() => {
  authServiceSpy.getEmail.and.returnValue('facu@gmail.com');
  planServiceSpy.obtenerHistorialPlanes.and.returnValue(of({
    exito: true,
    mensaje: 'OK',
    objeto: []
  }));

  fixture.detectChanges();
  tick();

  expect(component.cargando).toBeFalse();
}));

it('debería mantener cargando en true hasta recibir la respuesta', fakeAsync(() => {
  authServiceSpy.getEmail.and.returnValue('facu@gmail.com');
  
  const subject = new Subject<any>();
  planServiceSpy.obtenerHistorialPlanes.and.returnValue(subject.asObservable());

  component.ngOnInit();

  expect(component.cargando).toBeTrue(); 

  subject.next({ exito: true, mensaje: 'OK', objeto: [] });
  subject.complete();
  tick();

  expect(component.cargando).toBeFalse(); 
}));


it('obtenerHistorialPlanes no debería llamar al servicio si no hay email', () => {
  component.email = null;

  component.obtenerHistorialPlanes();

  expect(planServiceSpy.obtenerHistorialPlanes).not.toHaveBeenCalled();
  expect(toastrSpy.error).toHaveBeenCalledWith('No se pudo obtener el email del usuario');
  expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
});

it('formatearTiempo debería devolver 00:00 si se pasa 0 segundos', () => {
  expect(component.formatearTiempo(0)).toBe('00:00');
});

it('formatearTiempo debería manejar horas y minutos exactos correctamente', () => {
  expect(component.formatearTiempo(1800)).toBe('30:00'); 
  expect(component.formatearTiempo(7200)).toBe('02:00:00'); 
});

});
