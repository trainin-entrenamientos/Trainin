/*import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ListadoDeEjerciciosComponent } from './listado-de-ejercicios.component';
import { EjercicioService } from '../../core/servicios/EjercicioServicio/ejercicio.service';
import { ToastrService } from 'ngx-toastr';
import { RespuestaApi } from '../../core/modelos/RespuestaApiDTO';

describe('ListadoDeEjerciciosComponent', () => {
    let component: ListadoDeEjerciciosComponent;
    let fixture: ComponentFixture<ListadoDeEjerciciosComponent>;
    let svcSpy: jasmine.SpyObj<EjercicioService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let toastrSpy: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        svcSpy = jasmine.createSpyObj('EjercicioService', ['obtenerTodosLosEjercicios', 'eliminarEjercicio']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

        await TestBed.configureTestingModule({
            declarations: [ListadoDeEjerciciosComponent],
            providers: [
                { provide: EjercicioService, useValue: svcSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ToastrService, useValue: toastrSpy }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ListadoDeEjerciciosComponent);
        component = fixture.componentInstance;
    });

    it('Debería crearse con los valores iniciales correctos', () => {
        expect(component).toBeTruthy();
        expect(component.ejercicios).toEqual([]);
        expect(component.mostrarModalDeConfirmacion).toBeFalse();
        expect(component.ejercicioSeleccionado).toBeNull();
        expect(component.mensajeModal).toBe('');
        expect(component.cargando).toBeTrue();
        expect(component.sortDirection).toBe('asc');
    });

    it('Debería devolver la lista de ejercicios al iniciar', () => {
        spyOn(component, 'listarEjercicios');
        component.ngOnInit();
        expect(component.listarEjercicios).toHaveBeenCalled();
    });

    it('Debería mostrar los ejercicios y ocultar el cargando al cargar exitosamente el listado', fakeAsync(() => {
        const datos = [{ id: 2 }, { id: 1 }];
        svcSpy.obtenerTodosLosEjercicios.and.returnValue(of({ objeto: datos } as any));

        component.listarEjercicios();
        tick();

        expect(component.ejercicios).toEqual(datos);
        expect(component.cargando).toBeFalse();
    }));

    it('Debería ocultar el cargando y mostrar error si falla la carga del listado de ejercicios', fakeAsync(() => {
        svcSpy.obtenerTodosLosEjercicios.and.returnValue(throwError(() => new Error('fallo')));
        component.listarEjercicios();
        tick();

        expect(toastrSpy.error).toHaveBeenCalledWith('No se pudo obtener la lista de ejercicios');
        expect(component.cargando).toBeFalse();
    }));

    it('Debería llevar a la pantalla de creación al clickear en crear', () => {
        component.crear();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/crear']);
    });

    it('Debería llevar a la pantalla de edición al clickear en el ícono de editar', () => {
        component.editar({ id: 99 });
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/editar', 99]);
    });

    it('Debería abrir el modal con el mensaje correcto al clickear en el ícono de eliminar', () => {
        const ejercicio = { id: 5, nombre: 'Sentadilla' };
        component.abrirModal(ejercicio);
        expect(component.ejercicioSeleccionado).toBe(ejercicio);
        expect(component.mensajeModal).toContain('¿Estás segur@ de eliminar el ejercicio “Sentadilla”?');
        expect(component.mostrarModalDeConfirmacion).toBeTrue();
    });

    it('Debería cerrar el modal al cancelar la eliminación del ejercicio', () => {
        component.ejercicioSeleccionado = { id: 3 };
        component.mostrarModalDeConfirmacion = true;
        component.cancelarEliminarEjercicio();
        expect(component.ejercicioSeleccionado).toBeNull();
        expect(component.mostrarModalDeConfirmacion).toBeFalse();
    });

    it('Debería quitar el ejercicio de la lista y cerrar el modal si la eliminación es exitosa', fakeAsync(() => {
        const resp: RespuestaApi<string> = {
            mensaje: 'ok',
            objeto: '',
            exito: true
        };
        svcSpy.eliminarEjercicio.and.returnValue(of(resp));

        spyOn(component, 'cancelarEliminarEjercicio');
        component.ejercicios = [{ id: 1 }, { id: 2 }];
        component.eliminar({ id: 1 });
        tick();

        expect(component.ejercicios).toEqual([{ id: 2 }]);
        expect(component.cancelarEliminarEjercicio).toHaveBeenCalled();
    }));

    it('Debería mostrar error y cerrar el modal si falla la eliminación del ejercicio', fakeAsync(() => {
        component.ejercicios = [{ id: 3 }];
        svcSpy.eliminarEjercicio.and.returnValue(throwError(() => new Error('err')));
        spyOn(component, 'cancelarEliminarEjercicio');

        component.eliminar({ id: 3 });
        tick();

        expect(toastrSpy.error).toHaveBeenCalledWith('No se pudo eliminar el ejercicio');
        expect(component.cancelarEliminarEjercicio).toHaveBeenCalled();
    }));

    it('Debería cambiar el orden de la lista al alternar la dirección desde el ícono', () => {
        component.ejercicios = [{ id: 2 }, { id: 1 }];
        component.sortDirection = 'asc';

        component.toggleSort();
        expect(component.sortDirection).toBe('desc');
        expect(component.ejercicios[0].id).toBe(2);

        component.toggleSort();
        expect(component.sortDirection).toBe('asc');
        expect(component.ejercicios[0].id).toBe(1);
    });
});*/