import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CrearPlanEntrenamientoComponent } from './crear-plan-entrenamiento.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CrearPlanEntrenamientoComponent', () => {
  let component: CrearPlanEntrenamientoComponent;
  let fixture: ComponentFixture<CrearPlanEntrenamientoComponent>;
  let planEntrenamientoServiceMock: jasmine.SpyObj<PlanEntrenamientoService>;
  let usuarioServiceMock: jasmine.SpyObj<UsuarioService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let logroServiceMock: jasmine.SpyObj<LogroService>;
  let routerMock: jasmine.SpyObj<Router>;
  let toastrMock: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    planEntrenamientoServiceMock = jasmine.createSpyObj('PlanEntrenamientoService', [
      'obtenerOpcionesEntrenamiento',
      'obtenerEquipamiento',
      'crearPlanEntrenamiento',
      'getPlanesDeEntrenamiento'
    ]);
    usuarioServiceMock = jasmine.createSpyObj('UsuarioService', ['obtenerUsuarioPorEmail']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getEmail']);
    logroServiceMock = jasmine.createSpyObj('LogroService', ['mostrarLogro']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    toastrMock = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    TestBed.configureTestingModule({
      declarations: [CrearPlanEntrenamientoComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: PlanEntrenamientoService, useValue: planEntrenamientoServiceMock },
        { provide: UsuarioService, useValue: usuarioServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: LogroService, useValue: logroServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ToastrService, useValue: toastrMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearPlanEntrenamientoComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    authServiceMock.getEmail.and.returnValue('test@example.com');
    usuarioServiceMock.obtenerUsuarioPorEmail.and.returnValue(of({
      exito: true,
      mensaje: 'Usuario obtenido exitosamente',
      objeto: { id: 1, esPremium: false, nombre: 'Test', apellido: 'User', email: 'test@example.com', contraseña: '', caloriasTotales: 0, altura: 170 }
    }));

    planEntrenamientoServiceMock.obtenerOpcionesEntrenamiento.and.returnValue(of({
      exito: true,
      mensaje: 'Opciones de entrenamiento obtenidas exitosamente',
      objeto: []
    }));

    planEntrenamientoServiceMock.obtenerEquipamiento.and.returnValue(of({
      exito: true,
      mensaje: 'Equipamiento obtenido exitosamente',
      objeto: []
    }));

    planEntrenamientoServiceMock.getPlanesDeEntrenamiento.and.returnValue(of({
      exito: true,
      mensaje: 'Planes de entrenamiento obtenidos correctamente',
      objeto: []
    }));

    planEntrenamientoServiceMock.crearPlanEntrenamiento.and.returnValue(of({
      exito: true,
      mensaje: 'Plan creado',
      objeto: {
        planId: 1,
        logro: undefined
      }
    }));

    fixture.detectChanges();
  });

  it('debe ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debe obtener el usuario correctamente y obtener sus planes', () => {
    component.obtenerUsuario();
    expect(usuarioServiceMock.obtenerUsuarioPorEmail).toHaveBeenCalled();
    expect(component.usuario).toEqual({
      id: 1,
      nombre: 'Test',
      apellido: 'User',
      email: 'test@example.com',
      contraseña: '',
      esPremium: false,
      caloriasTotales: 0,
      altura: 170
    });
  });

  it('debe avanzar al siguiente paso', fakeAsync(() => {
    component.currentStep = 1;
    component.formularioForm.controls['pesoUsuario'].setValue(70);
    component.formularioForm.controls['alturaUsuario'].setValue(180);
    component.formularioForm.controls['objetivo'].setValue(1);
    component.formularioForm.controls['tipoEntrenamiento'].setValue(1);
    component.formularioForm.controls['equipamientos'].setValue([1]);

    component.nextStep();
    tick(250);
    expect(component.currentStep).toBe(2);
    expect(component.progresoVisual).toBe(40);
  }));

  it('debe retroceder al paso anterior', fakeAsync(() => {
    component.nextStep();
    component.previousStep();
    tick();
    expect(component.currentStep).toBe(1);
    expect(component.progresoVisual).toBe(20);
  }));

  it('debe ser válido si las contraseñas coinciden', fakeAsync(() => {
    component.formularioForm.controls['pesoUsuario'].setValue(70);
    component.formularioForm.controls['alturaUsuario'].setValue(180);
    component.formularioForm.controls['objetivo'].setValue(1);
    component.formularioForm.controls['tipoEntrenamiento'].setValue(1);
    component.formularioForm.controls['equipamientos'].setValue([1]);

    tick();
    expect(component.formularioForm.valid).toBeTrue();
  }));

  it('debe mostrar error si el formulario no es válido', fakeAsync(() => {
    component.formularioForm.controls['pesoUsuario'].setValue('');
    component.formularioForm.controls['alturaUsuario'].setValue('');
    component.formularioForm.controls['objetivo'].setValue(null);
    component.enviarFormulario();
    tick();
    expect(toastrMock.error).toHaveBeenCalledWith('El formulario no es válido');
  }));

  it('debe crear el plan de entrenamiento y mostrar el modal', fakeAsync(() => {
    component.formularioForm.controls['pesoUsuario'].setValue(60);
    component.formularioForm.controls['alturaUsuario'].setValue(170);
    component.formularioForm.controls['objetivo'].setValue('x');
    component.formularioForm.controls['tipoEntrenamiento'].setValue(1);
    component.formularioForm.controls['equipamientos'].setValue([1]);

    component.enviarFormulario();
    tick();
    expect(planEntrenamientoServiceMock.crearPlanEntrenamiento).toHaveBeenCalled();
    expect(component.mostrarModal).toBeTrue();
  }));

  it('debe navegar a la página de detalles del plan cuando se selecciona "detalle"', fakeAsync(() => {
    component.planIdCreado = 1;
    component.manejarAccion('detalle');
    tick();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/detalle-plan', 1]);
  }));

  it('debe navegar a la página de inicio de la rutina cuando se selecciona "iniciar"', fakeAsync(() => {
    component.planIdCreado = 1;
    component.manejarAccion('iniciar');
    tick();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/inicio-rutina', 1]);
  }));

  it('debe mostrar error si no hay un ID de plan creado al intentar navegar', fakeAsync(() => {
    component.planIdCreado = undefined;
    component.manejarAccion('detalle');
    tick();
    expect(toastrMock.error).toHaveBeenCalledWith('No hay un ID de plan creado.');
  }));

  it('debe configurar los sliders correctamente', fakeAsync(() => {
    component.configurarSliders();
    tick();
    expect(component.progresoVisual).toBe(20);
  }));

  it('debe mostrar los valores del resumen correctamente', fakeAsync(() => {
    component.opcionSeleccionada = 'Fuerza';
    component.equipamientos = ['Mancuernas', 'Banco'];

    spyOn(component, 'getInputValueById').and.callFake((id: string) => {
      switch (id) {
        case 'rangoExigencia': return '3';
        case 'rangoDiasSemanales': return '2';
        case 'rangoMinutos': return '2';
        case 'duracionPlan': return '2';
        default: return '';
      }
    });

    const resumenEntrenamiento = document.createElement('div');
    resumenEntrenamiento.id = 'resumenEntrenamiento';
    fixture.nativeElement.appendChild(resumenEntrenamiento);

    const resumenEquipamiento = document.createElement('div');
    resumenEquipamiento.id = 'resumenEquipamiento';
    fixture.nativeElement.appendChild(resumenEquipamiento);

    const resumenExigencia = document.createElement('div');
    resumenExigencia.id = 'resumenExigencia';
    fixture.nativeElement.appendChild(resumenExigencia);

    component.cargarResumen();
    tick();

    expect(resumenEntrenamiento.innerText).toBe('Fuerza');
    expect(resumenEquipamiento.innerText).toContain('Mancuernas');
    expect(resumenExigencia.innerText).toBe('Moderada');
  }));

});
