import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Renderer2 } from '@angular/core';
import { CrearPlanEntrenamientoComponent } from './crear-plan-entrenamiento.component';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { Router } from '@angular/router';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';

describe('CrearPlanEntrenamientoComponent', () => {
  let component: CrearPlanEntrenamientoComponent;
  let fixture: ComponentFixture<CrearPlanEntrenamientoComponent>;
  let planServiceSpy: jasmine.SpyObj<PlanEntrenamientoService>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let logroSpy: jasmine.SpyObj<LogroService>;
  let renderer: Renderer2;

  beforeEach(async () => {
    planServiceSpy = jasmine.createSpyObj('PlanEntrenamientoService', [
      'obtenerOpcionesEntrenamiento', 'obtenerEquipamiento', 'obtenerObjetivos', 'crearPlanEntrenamiento'
    ]);
    authSpy = jasmine.createSpyObj('AuthService', ['getEmail']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    logroSpy = jasmine.createSpyObj('LogroService', ['mostrarLogro']);

    await TestBed.configureTestingModule({
      declarations: [ CrearPlanEntrenamientoComponent ],
      imports: [ ReactiveFormsModule, FormsModule ],
      providers: [
        { provide: PlanEntrenamientoService, useValue: planServiceSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: LogroService, useValue: logroSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearPlanEntrenamientoComponent);
    component = fixture.componentInstance;
    renderer = fixture.componentRef.injector.get(Renderer2);

    planServiceSpy.obtenerOpcionesEntrenamiento.and.returnValue(of([]));
    planServiceSpy.obtenerEquipamiento.and.returnValue(of([]));
    planServiceSpy.obtenerObjetivos.and.returnValue(of([]));
    authSpy.getEmail.and.returnValue('test@example.com');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('step navigation', () => {
    it('nextStep increments valid step', () => {
      component.currentStep = 1;
      component.formularioForm.get('pesoUsuario')!.setValue(50);
      component.formularioForm.get('alturaUsuario')!.setValue(150);
      component.nextStep();
      expect(component.currentStep).toBe(2);
    });

    it('nextStep marks touched when invalid', () => {
      component.currentStep = 1;
      spyOn(component, 'marcarCamposDelPasoComoTocados');
      component.nextStep();
      expect(component.marcarCamposDelPasoComoTocados).toHaveBeenCalledWith(1);
      expect(component.currentStep).toBe(1);
    });

    it('previousStep decrements step', () => {
      component.currentStep = 3;
      component.previousStep();
      expect(component.currentStep).toBe(2);
    });

    it('irAPaso sets step and editandoDesdeResumen', () => {
      component.irAPaso(5);
      expect(component.currentStep).toBe(5);
      expect(component.editandoDesdeResumen).toBeTrue();
    });

    it('volverAlResumen resets to totalSteps', () => {
      spyOn(component, 'cargarResumen');
      component.volverAlResumen();
      expect(component.currentStep).toBe(component.totalSteps);
      expect(component.editandoDesdeResumen).toBeFalse();
      expect(component.cargarResumen).toHaveBeenCalled();
    });

    it('irAPlanes navigates to /planes', () => {
      component.irAPlanes();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
    });
  });

  describe('form validation', () => {
    it('esPasoActualValido returns false when fields invalid', () => {
      component.currentStep = 1;
      expect(component.esPasoActualValido()).toBeFalse();
    });

    it('esPasoActualValido returns true when valid', () => {
      component.currentStep = 2;
      component.formularioForm.get('objetivo')!.setValue('x');
      expect(component.esPasoActualValido()).toBeTrue();
    });
  });

  describe('card selection', () => {
    beforeEach(() => {
      component.opcionesEntrenamiento = [ { id:1, nombre:'A', descripcion:'A' } as any ];
    });

    it('seleccionarCard sets form value and marks touched', () => {
      component.seleccionarCard('A');
      expect(component.opcionSeleccionada).toBe('A');
      expect(component.formularioForm.get('tipoEntrenamiento')!.value).toBe(1);
    });

    it('hoverCard and leaveCard toggle hoveredCard', () => {
      component.hoverCard('test');
      expect(component.hoveredCard).toBe('test');
      component.leaveCard('test');
      expect(component.hoveredCard).toBeNull();
    });
  });

  describe('equipamiento toggle', () => {
    beforeEach(() => {
      component.equipamientosOpciones = [
        { id:1, descripcion:'X' } as any,
        { id:2, descripcion:'Ninguno' } as any
      ];
    });

    it('toggleEquipamiento exclusivo Ninguno', () => {
      component.toggleEquipamiento({ id:2, descripcion:'Ninguno' } as any);
      expect(component.equipamientos).toEqual(['Ninguno']);
      expect(component.formularioForm.get('equipamientos')!.value).toEqual([2]);
    });

    it('toggleEquipamiento añade y remueve', () => {
      component.toggleEquipamiento({ id:1, descripcion:'X' } as any);
      expect(component.equipamientos).toEqual(['X']);
      component.toggleEquipamiento({ id:1, descripcion:'X' } as any);
      expect(component.equipamientos).toEqual([]);
    });

    it('estaSeleccionado checks array', () => {
      component.equipamientos = ['X'];
      expect(component.estaSeleccionado({ descripcion:'X' } as any)).toBeTrue();
    });
  });

  describe('slider configuration', () => {
    beforeEach(() => {
      const host = fixture.nativeElement;
      host.innerHTML = `
        <input id="testSlider" value="3" />
        <div id="testFill"></div>
        <div class="scale-track">
          <span class="scale-point"></span>
          <span class="scale-point"></span>
          <span class="scale-point"></span>
          <span class="scale-point"></span>
        </div>
      `;
    });

    it('configurarSlider updates UI and responds to input event', fakeAsync(() => {
      const host = fixture.nativeElement;
      component.el = { nativeElement: host } as any;
      component.configurarSlider('testSlider','testFill','.scale-point',1,4);
      const fill = host.querySelector('#testFill') as HTMLElement;
      expect(fill.style.width).toBe('66.6667%');

      const input = host.querySelector('#testSlider') as HTMLInputElement;
      input.value = '2';
      input.dispatchEvent(new Event('input'));
      tick();
      expect(fill.style.width).not.toBe('66.6667%');
    }));
  });

  describe('cargarResumen and setters', () => {
    beforeEach(() => {
      const host = fixture.nativeElement;
      host.innerHTML = `
        <input type="number" value="60" />
        <input type="number" value="180" />
        <input name="objetivo" checked name="objVal" />
        <div id="resumenPeso"></div>
        <div id="resumenAlturaUsuario"></div>
        <div id="resumenObjetivo"></div>
        <div id="resumenEntrenamiento"></div>
        <div id="resumenEquipamiento"></div>
        <div id="resumenImagenesEquipamiento"></div>
        <input id="rangoExigencia" value="2" />
        <input id="rangoDiasSemanales" value="3" />
        <input id="rangoMinutos" value="1" />
        <input id="duracionPlan" value="2" />
        <div id="resumenExigencia"></div>
        <div id="resumenDiasSemanales"></div>
        <div id="resumenMinutos"></div>
        <div id="resumenDuracionPlan"></div>
      `;
      component.el = { nativeElement: fixture.nativeElement } as any;
      component.opcionesEntrenamiento = [];
      component.opcionSeleccionada = null;
      component.equipamientos = [];
    });

    it('cargarResumen populates text and hides images appropriately', () => {
      component.cargarResumen();
      const host = fixture.nativeElement;
      expect(host.querySelector('#resumenPeso').innerText).toBe('60');
      expect(host.querySelector('#resumenAlturaUsuario').innerText).toBe('180');
      expect(host.querySelector('#resumenObjetivo').innerText).toBe('No seleccionado');
      expect(host.querySelector('#resumenEntrenamiento').innerText).toBe('No seleccionado');
      expect(host.querySelector('#resumenEquipamiento').innerText).toBe('No seleccionado');
      expect(host.querySelector('#resumenExigencia').innerText).toBe('Baja');
      expect(host.querySelector('#resumenDiasSemanales').innerText).toBe('3 días');
      expect(host.querySelector('#resumenMinutos').innerText).toBe('≈15 min.');
      expect(host.querySelector('#resumenDuracionPlan').innerText).toBe('30 días');
    });
  });

  describe('enviarFormulario', () => {
    it('success path', fakeAsync(() => {
      planServiceSpy.crearPlanEntrenamiento.and.returnValue(of({ planId: 42, logro: { id: 1 } }));
      spyOn(console, 'error');
      component.formularioForm.patchValue({
        pesoUsuario: 60,
        alturaUsuario: 170,
        objetivo: 'x',
        tipoEntrenamiento: 1,
        equipamientos: [1]
      });
      component.enviarFormulario();
      tick();
      expect(authSpy.getEmail).toHaveBeenCalled();
      expect(component.planIdCreado).toBe(42);

      expect(logroSpy.mostrarLogro).toHaveBeenCalled();
      const llamado = logroSpy.mostrarLogro.calls.mostRecent().args[0] as any;
      expect(llamado.id).toBe(1);

      expect(component.mostrarModal).toBeTrue();
      expect(component.cargando).toBeFalse();
      expect(component.seEnvioForm).toBeTrue();
    }));

    it('error path logs error', fakeAsync(() => {
      planServiceSpy.crearPlanEntrenamiento.and.returnValue(throwError(() => new Error('fail')));
      spyOn(console, 'error');
      component.formularioForm.patchValue({
        pesoUsuario: 60,
        alturaUsuario: 170,
        objetivo: 'x',
        tipoEntrenamiento: 1,
        equipamientos: [1]
      });
      component.enviarFormulario();
      tick();
      expect(console.error).toHaveBeenCalled();
    }));
  });

  describe('iniciarRutina', () => {
    it('navigates when planIdCreado exists', () => {
      component.planIdCreado = 99;
      spyOn(console, 'error');
      component.iniciarRutina();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/inicio-rutina', 99]);
    });

    it('logs error when no planIdCreado', () => {
      spyOn(console, 'error');
      component.planIdCreado = undefined;
      component.iniciarRutina();
      expect(console.error).toHaveBeenCalledWith('No hay un ID de plan creado.');
    });
  });
});
