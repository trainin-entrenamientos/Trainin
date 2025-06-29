/*import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormAdminComponent } from './form-admin.component';
import { EjercicioService } from '../../core/servicios/EjercicioServicio/ejercicio.service';
import { ActivatedRoute } from '@angular/router';

/*
describe('FormAdminComponent', () => {
  let component: FormAdminComponent;
  let fixture: ComponentFixture<FormAdminComponent>;
  let svcSpy: jasmine.SpyObj<EjercicioService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: any;

  beforeEach(async () => {
    svcSpy = jasmine.createSpyObj('EjercicioService', [
      'obtenerCategorias',
      'obtenerGruposMusculares',
      'obtenerEjercicioPorId',
      'crearEjercicio',
      'editarEjercicio'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {
      snapshot: { paramMap: { get: (_: string) => null } }
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [FormAdminComponent],
      providers: [
        { provide: EjercicioService, useValue: svcSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormAdminComponent);
    component = fixture.componentInstance;
  });

  it('Debería crearse correctamente el componente form admin', () => {
    expect(component).toBeTruthy();
  });

  it('Debería mostrar las categorías y grupos vacíos al crear un ejercicio nuevo', () => {
    const cats = ['A', 'B'];
    const grps = ['X', 'Y'];
    svcSpy.obtenerCategorias.and.returnValue(of(cats));
    svcSpy.obtenerGruposMusculares.and.returnValue(of(grps));
    spyOn(component as any, 'cargarEjercicio');

    component.ngOnInit();
    expect(component.categorias).toEqual(cats);
    expect(component.grupos).toEqual(grps);
    expect((component as any).cargarEjercicio).not.toHaveBeenCalled();
  });

  it('Deberían cargarse los datos del ejercicio para su edición', () => {
    activatedRouteStub.snapshot.paramMap.get = (_: string) => '5';
    const cats: any[] = [], grps: any[] = [];
    svcSpy.obtenerCategorias.and.returnValue(of(cats));
    svcSpy.obtenerGruposMusculares.and.returnValue(of(grps));
    const dto = {
      id: 5,
      nombre: 'Ej1',
      descripcion: 'Desc',
      video: 'vid',
      valorMet: 10,
      landmark: 'L',
      tieneCorreccion: true,
      correccionPremium: false,
      idTipoEjercicio: 2,
      imagen: 'img.png',
      idsGrupoMuscular: [1, 3],
      idsCategorias: [4]
    };
    svcSpy.obtenerEjercicioPorId.and.returnValue(of(dto));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.form.value.nombre).toBe('Ej1');
    expect(component.idsGrupoMuscular.value).toEqual([1, 3]);
    expect(component.idsCategorias.value).toEqual([4]);
  });

  it('Deberían agregarse y quitarse valores a un ejercicio según los ítems seleccionados', () => {
    const arr: FormArray<any> = new FormArray<any>([]);
    component.onCheckboxChange(arr, true, 7);
    expect(arr.value).toEqual([7]);
    component.onCheckboxChange(arr, false, 7);
    expect(arr.value).toEqual([]);
  });

  it('Deberían poder seleccionarse y deseleccionarse grupos musculares y categorías para un ejercicio', () => {
    const arr = new FormArray([component['fb'].control(2)]);
    component.toggleSeleccion(arr, 2);
    expect(arr.value).toEqual([]);
    component.toggleSeleccion(arr, 3);
    expect(arr.value).toEqual([3]);
  });

  it('No debería enviar el formulario si faltan datos y debería mostrar errores', () => {
    component.form.patchValue({ nombre: '', descripcion: '', valorMet: null });
    spyOn(component.form, 'markAllAsTouched');
    component.submit();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('Debería guardarse el ejercicio creado y volver al usuario al listado de ejercicios', fakeAsync(() => {
    component.isEdit = false;
    svcSpy.crearEjercicio.and.returnValue(of(''));
    component.form.patchValue({
      nombre: 'Nueva',
      descripcion: 'Desc',
      valorMet: 5,
      idTipoEjercicio: 1
    });
    (component.form.get('idsGrupoMuscular') as FormArray).push(component['fb'].control(1));
    (component.form.get('idsCategorias') as FormArray).push(component['fb'].control(1));

    component.submit();
    tick();
    expect(svcSpy.crearEjercicio).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/listarEjercicios']);
  }));

  it('Debería devolver un error si falla la creación del ejercicio', fakeAsync(() => {
    component.isEdit = false;
    const err = new Error('fail');
    svcSpy.crearEjercicio.and.returnValue(throwError(() => err));
    spyOn(console, 'error');
    component.form.patchValue({
      nombre: 'X',
      descripcion: 'Y',
      valorMet: 1,
      idTipoEjercicio: 1
    });
    (component.form.get('idsGrupoMuscular') as FormArray).push(component['fb'].control(1));
    (component.form.get('idsCategorias') as FormArray).push(component['fb'].control(1));

    component.submit();
    tick();
    expect(console.error).toHaveBeenCalledWith('Error al guardar ejercicio:', err);
  }));

  it('Debería guardar los cambios de un ejercicio y volver al listado', fakeAsync(() => {
    component.isEdit = true;
    svcSpy.editarEjercicio.and.returnValue(of(''));
    component.form.patchValue({
      id: 10,
      nombre: 'Edit',
      descripcion: 'DescE',
      valorMet: 2,
      idTipoEjercicio: 2
    });
    (component.form.get('idsGrupoMuscular') as FormArray).push(component['fb'].control(2));
    (component.form.get('idsCategorias') as FormArray).push(component['fb'].control(2));

    component.submit();
    tick();
    expect(svcSpy.editarEjercicio).toHaveBeenCalledWith(10, jasmine.any(Object));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/listarEjercicios']);
  }));

  it('Debería mostrar un mensaje si falla la carga de datos al editar', () => {
    spyOn(console, 'error');
    svcSpy.obtenerEjercicioPorId.and.returnValue(
      throwError(() => new Error('falló fetch ejercicio'))
    );
    (component as any).cargarEjercicio(7);
    expect(console.error)
      .toHaveBeenCalledWith('Error al cargar el ejercicio:', jasmine.any(Error));
  });

});*/
