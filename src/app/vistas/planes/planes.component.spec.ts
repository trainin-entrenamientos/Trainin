// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { of, throwError } from 'rxjs';
// import { Router } from '@angular/router';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// import { PlanesComponent } from './planes.component';
// import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
// import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
// import { AuthService } from '../../core/servicios/authServicio/auth.service';

// describe('PlanesComponent', () => {
//   let component: PlanesComponent;
//   let fixture: ComponentFixture<PlanesComponent>;

//   let planServiceSpy: jasmine.SpyObj<PlanEntrenamientoService>;
//   let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
//   let authServiceSpy: jasmine.SpyObj<AuthService>;
//   let routerSpy: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     planServiceSpy = jasmine.createSpyObj('PlanEntrenamientoService', [
//       'getPlanesDeEntrenamiento',
//       'desactivarPlanPorId'
//     ]);
//     usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', [
//       'obtenerUsuarioPorId'
//     ]);
//     authServiceSpy = jasmine.createSpyObj('AuthService', ['getEmail']);
//     routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//     await TestBed.configureTestingModule({
//       declarations: [PlanesComponent],
//       providers: [
//         { provide: PlanEntrenamientoService, useValue: planServiceSpy },
//         { provide: UsuarioService,         useValue: usuarioServiceSpy },
//         { provide: AuthService,            useValue: authServiceSpy },
//         { provide: Router,                 useValue: routerSpy },
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA],
//     }).compileComponents();

//     fixture = TestBed.createComponent(PlanesComponent);
//     component = fixture.componentInstance;
//   });

//   it('Debería obtener el email y el usuario asociado a ese email', () => {
//     expect(component).toBeTruthy();
//     expect(component.idUsuario).toBe(1);
//     expect(component.planEntrenamiento).toEqual([]);
//     expect(component.email).toBeNull();
//     expect(component.cargando).toBeTrue();
//     expect(component.planAEliminarId).toBeNull();
//     expect(component.mostrarModal).toBeFalse();
//   });

//   it('Debería obtener el email y un usuario', () => {

//     authServiceSpy.getEmail.and.returnValue('trainin@trainin.com');
//     spyOn(component, 'obtenerUsuario');
  
//     component.ngOnInit();
//     expect(component.email).toBe('trainin@trainin.com');
//     expect(component.obtenerUsuario).toHaveBeenCalled();
//   });

//   describe('Debería obtener un plan de entrenamiento', () => {
//     const mockPlanes = [{ id: 1, nombre: 'Plan A', fueRealizado: true, progresoSemanal: 1, totalProgresoSemanal: 1,
//           progresoPlan: 1, usuarioId: 250, totalPlanes: 2}, 
//       { id: 2, nombre: 'Plan B', fueRealizado: false, progresoSemanal: 0, totalProgresoSemanal: 0, progresoPlan: 0, usuarioId: 250, totalPlanes: 2}];

//       it('Debería obtener el plan de entrenamiento con los datos ingresados', () => {
//       planServiceSpy.getPlanesDeEntrenamiento.and.returnValue(of(mockPlanes));
//       component.planEntrenamiento = []; 
//       component.obtenerPlanEntrenamiento(42);

//       expect(planServiceSpy.getPlanesDeEntrenamiento).toHaveBeenCalledWith(42);
//       expect(component.planEntrenamiento).toEqual(mockPlanes);
//     });

//     it('Debería vaciar la lista de planes y mostrar un error en consola si la carga de planes falla', () => {
//       const consoleSpy = spyOn(console, 'error');
//       planServiceSpy.getPlanesDeEntrenamiento.and.returnValue(throwError(() => new Error('fail')));
//       component.planEntrenamiento = [{ id: 9 }];
//       component.obtenerPlanEntrenamiento(99);

//       expect(planServiceSpy.getPlanesDeEntrenamiento).toHaveBeenCalledWith(99);
//       expect(component.planEntrenamiento).toEqual([]);
//       expect(consoleSpy).toHaveBeenCalledWith('No existen planes de entrenamiento', jasmine.any(Error));
//     });
//   });

// describe('obtenerUsuario', () => {
//     /*it('Debería llamar a obtenerUsuarioPorId, guardar los datos, actualizar el ID y cargar los planes al obtener el usuario con éxito', fakeAsync(() => {
//       component.email = 'user@demo.com';
//       const mockUsuario = { id: 7, nombre: 'Test', apellido: 'ApellidoTest', email: 'user@demo.com', contraseña: 'pwd123', esPremium: false, caloriasTotales: 0};
//       usuarioServiceSpy.obtenerUsuarioPorId.and.returnValue(of(mockUsuario));
//       spyOn(component, 'obtenerPlanEntrenamiento');

//       component.obtenerUsuario();

//       expect(usuarioServiceSpy.obtenerUsuarioPorId).toHaveBeenCalledWith('user@demo.com');
//       expect(component.usuario).toEqual(mockUsuario);
//       expect(component.idUsuario).toBe(7);
//       expect(component.obtenerPlanEntrenamiento).toHaveBeenCalledWith(7);
//       expect(component.cargando).toBeTrue();
//       tick(500);
//       expect(component.cargando).toBeFalse();
//     }));*/

//     it('Debería mostrar un error en consola si no se puede cargar los datos del usuario', () => {
//       const error = new Error('fail');
//       spyOn(console, 'error');
//       usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(throwError(() => error));

//       component.obtenerUsuario();

//       expect(console.error).toHaveBeenCalledWith('Error al obtener el usuario:', error);
//     });
//   });

//   describe('Debería calcular el porcentaje del progreso del plan de un usuario', () => {
//     it('Debería devolver 0% del progreso del plan si este es null', () => {
//       expect(component.calcularPorcentajeProgreso(null)).toBe('0%');
//     });

//     it('Debería devolver 0% si el plan no tiene datos de progreso', () => {
//       expect(component.calcularPorcentajeProgreso({} as any)).toBe('0.00%');
//     });

//     it('Debería calcular el porcentaje de progreso del plan de un usuario correctamente', () => {
//       const plan = { cantidadRutinasHechas: 2, cantidadRutinas: 5 };
//       expect(component.calcularPorcentajeProgreso(plan)).toBe('40.00%');
//     });
//   });

//   describe('Debería llevar al usuario al plan de entrenamiento', () => {

//     it('Debería llevar al usuario a hacer su rutina si este no ha realizado entrenamiento hoy', () => {
//       component.irAlPlan(20, 'Pendiente');
//       expect(routerSpy.navigate).toHaveBeenCalledWith(['/inicio-rutina', 20]);
//     });
//   });

//   describe('Debería de confirmar la eliminación del plan o la cancelación de esta acción', () => {
//     it('Debería guardar el ID y mostrar el modal al confirmar la eliminación del plan', () => {
//       component.confirmarEliminacion(5);
//       expect(component.planAEliminarId).toBe(5);
//       expect(component.mostrarModal).toBeTrue();
//     });

//     it('Debería ocultar el modal y borrar el ID al cancelar la eliminación del plan', () => {
//       component.planAEliminarId = 5;
//       component.mostrarModal = true;
//       component.cancelarEliminacion();
//       expect(component.planAEliminarId).toBeNull();
//       expect(component.mostrarModal).toBeFalse();
//     });
//   });

//   describe('Debería de confirmar la eliminación de un plan', () => {
//     it('“Debería desactivar el plan de un usuario y cerrar el modal al confirmar la eliminación del plan', () => {
//       component.planAEliminarId = 3;
//       component.mostrarModal = true;
//       spyOn(component, 'desactivarPlan');

//       component.eliminarPlanConfirmado();

//       expect(component.desactivarPlan).toHaveBeenCalledWith(3);
//       expect(component.planAEliminarId).toBeNull();
//       expect(component.mostrarModal).toBeFalse();
//     });

//     it('Debería no llamar a desactivarPlan y cerrar el modal si no había plan seleccionado al confirmar eliminación', () => {
//       component.planAEliminarId = null;
//       component.mostrarModal = true;
//       spyOn(component, 'desactivarPlan');

//       component.eliminarPlanConfirmado();

//       expect(component.desactivarPlan).not.toHaveBeenCalled();
//       expect(component.mostrarModal).toBeFalse();
//     });
//   });

//   describe('Debería desactivar un plan', () => {
//     it('Debería desactivar el plan, mostrar mensaje y recargar la lista cuando la desactivación es exitosa', () => {
//       const response = { success: true };
//       planServiceSpy.desactivarPlanPorId.and.returnValue(of(response));
//       component.idUsuario = 2;
//       spyOn(console, 'log');
//       spyOn(component, 'obtenerPlanEntrenamiento');

//       component.desactivarPlan(8);

//       expect(planServiceSpy.desactivarPlanPorId).toHaveBeenCalledWith(8, 2);
//       expect(console.log).toHaveBeenCalledWith('Plan desactivado:', response);
//       expect(component.obtenerPlanEntrenamiento).toHaveBeenCalledWith(2);
//     });

//     it('Debería mostrar error si el plan no puede desactivarse', () => {
//       const err = new Error('fail');
//       planServiceSpy.desactivarPlanPorId.and.returnValue(throwError(() => err));
//       spyOn(console, 'error');

//       component.desactivarPlan(9);

//       expect(console.error).toHaveBeenCalledWith('Error al desactivar el plan:', err);
//     });
//   });

//   describe('Debería ir al detalle de plan elegido', () => {
//     it('Debería ir al detalle del plan seleccionado según su id', () => {
//       component.irAlDetalleDelPlan(12);
//       expect(routerSpy.navigate).toHaveBeenCalledWith(['/detalle-plan', 12]);
//     });
//   });
//     });

/* CAMI REVISAR
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PlanesComponent } from '../planes/planes.component';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';

describe('PlanesComponent', () => {
    let component: PlanesComponent;
    let fixture: ComponentFixture<PlanesComponent>;

    let planServiceSpy: jasmine.SpyObj<PlanEntrenamientoService>;
    let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        planServiceSpy = jasmine.createSpyObj('PlanEntrenamientoService', [
            'getPlanesDeEntrenamiento',
            'desactivarPlanPorId'
        ]);
        usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', [
            'obtenerUsuarioPorEmail'
        ]);
        authServiceSpy = jasmine.createSpyObj('AuthService', ['getEmail']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            declarations: [PlanesComponent],
            providers: [
                { provide: PlanEntrenamientoService, useValue: planServiceSpy },
                { provide: UsuarioService, useValue: usuarioServiceSpy },
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(PlanesComponent);
        component = fixture.componentInstance;
    });

    it('Debería crearse el listado de ejercicios con los valores correctos', () => {
        expect(component).toBeTruthy();
        expect(component.idUsuario).toBe(1);
        expect(component.planEntrenamiento).toEqual([]);
        expect(component.email).toBeNull();
        expect(component.cargando).toBeTrue();
        expect(component.planAEliminarId).toBeNull();
        expect(component.mostrarModal).toBeFalse();
    });

    it('Debería mostrar el correo y pedir datos del usuario al iniciar el listado de ejercicios', () => {
        authServiceSpy.getEmail.and.returnValue('trainin@trainin.com');
        spyOn(component, 'obtenerUsuario');

        component.ngOnInit();
        expect(component.email).toBe('trainin@trainin.com');
        expect(component.obtenerUsuario).toHaveBeenCalled();
    });

    describe('Debería el administrador poder gestionar los ejercicios', () => {
        const mockPlanes = [
            { id: 1, nombre: 'Plan A', fueRealizado: true, progresoSemanal: 1, totalProgresoSemanal: 1, progresoPlan: 1, usuarioId: 250, totalPlanes: 2 },
            { id: 2, nombre: 'Plan B', fueRealizado: false, progresoSemanal: 0, totalProgresoSemanal: 0, progresoPlan: 0, usuarioId: 250, totalPlanes: 2 }
        ];

        it('Debería cargarse la lista de planes exitosamente', () => {
            const mockPlanes = [
                { id: 1, nombre: 'Plan A' },
                { id: 2, nombre: 'Plan B' }
            ];
            planServiceSpy.getPlanesDeEntrenamiento.and.returnValue(of(mockPlanes));
            component.planEntrenamiento = [];
            component.obtenerPlanEntrenamiento(42);

            expect(planServiceSpy.getPlanesDeEntrenamiento).toHaveBeenCalledWith(42);
            expect(component.planEntrenamiento).toEqual(mockPlanes);
        });

        it('Debería vaciarse la lista de planes de entrenamiento y mostrar error si falla la carga', () => {
            const consoleSpy = spyOn(console, 'error');
            planServiceSpy.getPlanesDeEntrenamiento.and.returnValue(throwError(() => new Error('fail')));
            component.planEntrenamiento = [{ id: 9 } as any];
            component.obtenerPlanEntrenamiento(99);

            expect(planServiceSpy.getPlanesDeEntrenamiento).toHaveBeenCalledWith(99);
            expect(component.planEntrenamiento).toEqual([]);
            expect(consoleSpy).toHaveBeenCalledWith('No existen planes de entrenamiento', jasmine.any(Error));
        });
    });

    describe('Debería poder gestionar al usuario', () => {
        it('Debería cargar el usuario, actualizar su email y ocultar el loader luego de 500 ms', fakeAsync(() => {
            component.email = 'user@demo.com';
            const mockUsuario = { id: 7, /* … *//* } as any;
            usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(of(mockUsuario));
            spyOn(component, 'obtenerPlanEntrenamiento');

            component.obtenerUsuario();
            expect(usuarioServiceSpy.obtenerUsuarioPorEmail).toHaveBeenCalledWith('user@demo.com');
            expect(component.usuario).toEqual(mockUsuario);
            expect(component.idUsuario).toBe(7);
            expect(component.obtenerPlanEntrenamiento).toHaveBeenCalledWith(7);
            tick(500);
            expect(component.cargando).toBeFalse();
        }));

        it('Debería mostrar un mensaje de error si no se puede obtener el usuario', () => {
            const error = new Error('fail');
            spyOn(console, 'error');
            usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(throwError(() => error));

            component.obtenerUsuario();

            expect(console.error).toHaveBeenCalledWith('Error al obtener el usuario:', error);
        });
    });

    describe('Debería calcularse el progreso de un plan de entrenamiento.', () => {
        it('muestra 0% cuando no hay datos de plan', () => {
            expect(component.calcularPorcentajeProgreso(null)).toBe('0%');
        });

        it('Debería gestionar valores vacíos', () => {
            expect(component.calcularPorcentajeProgreso({} as any)).toBe('0.00%');
        });

        it('Debería calcular el porcentaje correcto de entrenamiento entre rutinas hechas y totales', () => {
            const plan = { cantidadRutinasHechas: 2, cantidadRutinas: 5 } as any;
            expect(component.calcularPorcentajeProgreso(plan)).toBe('40.00%');
        });
    });

    describe('Debería poder navegar entre diferentes vistas', () => {
        it('Debería llevar al usuario al detalle de plan si ya entrenó hoy', () => {
            component.irAlPlan(15, 'Realizada hoy');
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/detalle-plan', 15]);
        });

        it('Debería llevar al usuario al inicio de rutina si no entrenó hoy', () => {
            component.irAlPlan(20, 'Pendiente');
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/inicio-rutina', 20]);
        });
    });

    describe('Debería gestionar la eliminación de un ejercicio exitosamente', () => {
        it('Debería mostrar el modal antes de eliminar el ejercicio', () => {
            component.eliminar(5);
            expect(component.confirmarEliminacion).toBe(5);
            expect(component.mostrarModal).toBeTrue();
        });

        it('Debería cerrar el modal sin eliminar el plan de entrenamiento si el usuario da click en cancelar', () => {
            component.planAEliminarId = 5;
            component.mostrarModal = true;
            component.cancelarEliminacion();
            expect(component.planAEliminarId).toBeNull();
            expect(component.mostrarModal).toBeFalse();
        });

        it('Debería confirmar y eliminar un plan seleccionado', () => {
            component.planAEliminarId = 3;
            component.mostrarModal = true;
            spyOn(component, 'desactivarPlan');

            component.eliminarPlanConfirmado();

            expect(component.desactivarPlan).toHaveBeenCalledWith(3);
            expect(component.planAEliminarId).toBeNull();
            expect(component.mostrarModal).toBeFalse();
        });

        it('Debería cerrar el modal si no hay plan seleccionado', () => {
            component.planAEliminarId = null;
            component.mostrarModal = true;
            spyOn(component, 'desactivarPlan');

            component.eliminarPlanConfirmado();

            expect(component.desactivarPlan).not.toHaveBeenCalled();
            expect(component.mostrarModal).toBeFalse();
        });
    });

    describe('Debería desactivar un plan', () => {
        it('Debería desactivar el plan seleccionado y recargar la lista al tener éxito', () => {
            const response = { success: true };
            planServiceSpy.desactivarPlanPorId.and.returnValue(of(response));
            component.idUsuario = 2;
            spyOn(console, 'log');
            spyOn(component, 'ListadoDeEjerciciosComponent');

            component.desactivarPlan(8);

            expect(planServiceSpy.desactivarPlanPorId).toHaveBeenCalledWith(8, 2);
            expect(console.log).toHaveBeenCalledWith('Plan desactivado:', response);
            expect(component.obtenerPlanEntrenamiento).toHaveBeenCalledWith(2);
        });

        it('Debería mostrar error si no se pudo desactivar el plan', () => {
            const err = new Error('fail');
            planServiceSpy.desactivarPlanPorId.and.returnValue(throwError(() => err));
            spyOn(console, 'error');

            component.desactivarPlan(9);

            expect(console.error).toHaveBeenCalledWith('Error al desactivar el plan:', err);
        });
    });

    describe('Debería poder visualizarse el detalle de un plan de entrenamiento', () => {
        it('va a la página de detalle con el id correcto', () => {
            component.irAlDetalleDelPlan(12);
            expect(routerSpy.navigate).toHaveBeenCalledWith(['/detalle-plan', 12]);
        });
    });
});*/