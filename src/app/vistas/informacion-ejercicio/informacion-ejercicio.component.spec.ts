import { ComponentFixture, fakeAsync, TestBed, tick, } from '@angular/core/testing';
import { InformacionEjercicioComponent } from './informacion-ejercicio.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RutinaService } from '../../core/servicios/rutinaServicio/rutina.service';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { NombreEjercicio } from '../../compartido/enums/nombre-ejercicio.enum';
import { Rutina, Ejercicio } from '../../core/modelos/RutinaDTO';
import { TemporizadorComponent } from '../../compartido/componentes/temporizador/temporizador.component';
import { ToastrService } from 'ngx-toastr';
import * as ErroresToastr from '../../compartido/utilidades/errores-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RespuestaApi } from '../../core/modelos/RespuestaApiDTO';
import { Usuario } from '../../core/modelos/Usuario';

describe('InformacionEjercicioComponent', () => {
    let component: InformacionEjercicioComponent;
    let fixture: ComponentFixture<InformacionEjercicioComponent>;

    let rutinaServiceSpy: jasmine.SpyObj<RutinaService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let temporizadorServiceSpy: jasmine.SpyObj<TemporizadorService>;
    let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let toastrSpy: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        rutinaServiceSpy = jasmine.createSpyObj('RutinaService', [
            'cargarDesdeSession',
            'getDatosIniciales',
            'buscarNombreEjercicio',
            'getIndiceActual'
        ]);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        temporizadorServiceSpy = jasmine.createSpyObj('TemporizadorService', [
            'estaCorriendoTiempo',
            'continuar',
            'accionesDePausa',
            'formatearTiempo'
        ]);
        usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['obtenerUsuarioPorEmail']);
        authServiceSpy = jasmine.createSpyObj('AuthService', ['getEmail']);
        toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

        await TestBed.configureTestingModule({
            declarations: [InformacionEjercicioComponent],
            providers: [
                { provide: RutinaService, useValue: rutinaServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: TemporizadorService, useValue: temporizadorServiceSpy },
                { provide: UsuarioService, useValue: usuarioServiceSpy },
                { provide: AuthService, useValue: authServiceSpy },
                { provide: ToastrService, useValue: toastrSpy }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(InformacionEjercicioComponent);
        component = fixture.componentInstance;
    });

    const mockEjercicio: Ejercicio = {
        id: 1,
        nombre: 'Press militar',
        repeticiones: null,
        series: null,
        duracion: null,
        imagen: '',
        video: '',
        descripcion: '',
        tieneCorrecion: false,
        categoria: [],
        grupoMuscular: [],
        correccionPremium: false,
        tipoEjercicio: 'De tiempo',
    };
    const rutinaMock = {
        id: 1,
        numeroRutina: 1,
        duracionEstimada: 2,
        nombre: 'Rutina de prueba',
        ejercicios: [{
            id: 1,
            nombre: 'Sentadillas',
            repeticiones: 10,
            series: 3,
            duracion: 30,
            imagen: '',
            video: '',
            descripcion: '',
            tieneCorrecion: false,
            categoria: [],
            grupoMuscular: [],
            correccionPremium: false,
            tipoEjercicio: 'De tiempo'
        }],
        categoriaEjercicio: '',
        rutinasRealizadas: 0,
        caloriasQuemadas: 0,
        numeroDeRutinaSemanal: 1,
        cantidadDeRutinasTotales: 4,
        cantidadDeRutinasPorSemana: 1,
    };

    it('debería crearse correctamente', () => {
        expect(component).toBeTruthy();
    });

    it('debería cargar la rutina y datos correctamente si existe en sessionStorage', () => {

        const datosInicialesMock = {
            rutina: rutinaMock,
            ejercicio: rutinaMock.ejercicios[0],
            ejercicios: rutinaMock.ejercicios,
            indiceActual: 0,
            duracionDelEjercicio: '30 segundos',
            repeticionesDelEjercicio: '10 repeticiones',
            correccionPremium: false
        };
        rutinaServiceSpy.getDatosIniciales.and.returnValue(datosInicialesMock);
        temporizadorServiceSpy.estaCorriendoTiempo.and.returnValue(false);

        usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(of({
            exito: true,
            mensaje: 'Usuario obtenido',
            objeto: {
                id: 1,
                nombre: 'Leo',
                apellido: 'Vilte',
                email: 'leo@email.com',
                contraseña: '1234',
                esPremium: true,
                caloriasTotales: 0,
                altura: 175
            }
        }));

        component.ngOnInit();

        expect(component.rutina).toEqual(rutinaMock);
        expect(component.ejercicio).toEqual(rutinaMock.ejercicios[0]);
        expect(component.duracionDelEjercicio).toBe('30 segundos');
        expect(component.repeticionesDelEjercicio).toBe('10 repeticiones');
        expect(component.indiceActual).toBe(0);
        expect(component.esEjercicioDeTiempo).toBeTrue();
    });

    it('debería redirigir si no hay rutina (manejarErrorYRedirigir)', () => {
        rutinaServiceSpy.getDatosIniciales.and.returnValue({
            rutina: null,
            ejercicio: mockEjercicio,
            ejercicios: [],
            indiceActual: 0,
            duracionDelEjercicio: '',
            repeticionesDelEjercicio: '',
            correccionPremium: false,
        });

        usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(of(respuestaApiUsuarioNoPremium));

        component.ngOnInit();

        expect(toastrSpy.error).toHaveBeenCalledWith('No se pudo obtener la rutina');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
    });

    it('debería asignar duración, repeticiones y ejercicio actual correctamente', () => {
        const datosInicialesMock = {
            rutina: rutinaMock,
            ejercicio: rutinaMock.ejercicios[0],
            ejercicios: rutinaMock.ejercicios,
            indiceActual: 0,
            duracionDelEjercicio: '30 segundos',
            repeticionesDelEjercicio: '10 repeticiones',
            correccionPremium: false
        };

        rutinaServiceSpy.getDatosIniciales.and.returnValue(datosInicialesMock);
        temporizadorServiceSpy.estaCorriendoTiempo.and.returnValue(false);

        usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(of(respuestaApiUsuarioNoPremium));

        component.ngOnInit();

        expect(component.ejercicio).toEqual(rutinaMock.ejercicios[0]);
        expect(component.duracionDelEjercicio).toBe('30 segundos');
        expect(component.repeticionesDelEjercicio).toBe('10 repeticiones');
    });
    it('debería activar esEjercicioDeTiempo si el tipo de ejercicio es "De tiempo"', () => {
        rutinaServiceSpy.getDatosIniciales.and.returnValue(datosInicialesMock);
        temporizadorServiceSpy.estaCorriendoTiempo.and.returnValue(false);

        usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(of(respuestaApiUsuarioNoPremium));

        component.ngOnInit();

        expect(component.esEjercicioDeTiempo).toBeTrue();
    });

    it('debería llamar a usuarioService.obtenerUsuarioPorEmail con el email del authService', () => {
        const mockEmail = 'test@correo.com';

        authServiceSpy.getEmail.and.returnValue(mockEmail);
        rutinaServiceSpy.getDatosIniciales.and.returnValue(datosInicialesMock);

        temporizadorServiceSpy.estaCorriendoTiempo.and.returnValue(false);

        usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(of(respuestaApiUsuarioNoPremium));

        component.ngOnInit();

        expect(usuarioServiceSpy.obtenerUsuarioPorEmail).toHaveBeenCalledWith(mockEmail);
    });

    it('debería marcar como premium si el usuario lo es', () => {
        authServiceSpy.getEmail.and.returnValue('premium@correo.com');

        rutinaServiceSpy.getDatosIniciales.and.returnValue(datosInicialesMock);
        temporizadorServiceSpy.estaCorriendoTiempo.and.returnValue(false);

        usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(of(respuestaApiUsuarioPremium))

        component.ngOnInit();

        expect(component.esUsuarioPremium).toBeTrue();
    });

    it('no debería marcar como premium si el usuario no lo es', () => {
        authServiceSpy.getEmail.and.returnValue('normal@correo.com');

        rutinaServiceSpy.getDatosIniciales.and.returnValue(datosInicialesMock);
        temporizadorServiceSpy.estaCorriendoTiempo.and.returnValue(false);

        usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(of(respuestaApiUsuarioNoPremium));

        component.ngOnInit();

        expect(component.esUsuarioPremium).toBeFalse();
    });

    it('debería iniciar el temporizador y disminuir el tiempoRestante', fakeAsync(() => {
        rutinaServiceSpy.getDatosIniciales.and.returnValue(datosInicialesMock);

        temporizadorServiceSpy.estaCorriendoTiempo.and.returnValue(true);

        usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(of(usuarioMock));

        component.ngOnInit();

        component.tiempoRestante = 3;
        tick(1000);
        expect(component.tiempoRestante).toBe(2);

        tick(1000);
        expect(component.tiempoRestante).toBe(1);

        tick(1000);
        expect(component.tiempoRestante).toBe(0);

        component.ngOnDestroy();
    }));

    it('debería redirigir a /realizar-ejercicio cuando el tiempo llega a 0', fakeAsync(() => {
        rutinaServiceSpy.getDatosIniciales.and.returnValue(datosInicialesMock);
        temporizadorServiceSpy.estaCorriendoTiempo.and.returnValue(true);
        usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(of(usuarioMock));

        component.ngOnInit();
        component.tiempoRestante = 1;

        tick(1000);

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/realizar-ejercicio']);
        component.ngOnDestroy();
    }));

    it('no debería disminuir el tiempo si estaPausado es true', fakeAsync(() => {
        rutinaServiceSpy.getDatosIniciales.and.returnValue(datosInicialesMock);
        temporizadorServiceSpy.estaCorriendoTiempo.and.returnValue(true);
        usuarioServiceSpy.obtenerUsuarioPorEmail.and.returnValue(of(usuarioMock));

        component.ngOnInit();
        component.tiempoRestante = 5;
        component.estaPausado = true;

        tick(3000);

        expect(component.tiempoRestante).toBe(5);
        component.ngOnDestroy();
    }));

    it('debería devolver clave válida si el nombre del ejercicio existe en el mapa', () => {
        const nombreValido = 'Press militar';
        const claveEsperada = NombreEjercicio.PRESS_MILITAR;

        component.ejercicio = {
            ...mockEjercicio,
            nombre: nombreValido
        };

        rutinaServiceSpy.buscarNombreEjercicio.and.returnValue(claveEsperada);

        const resultado = component.claveEjercicioCorreccion();

        expect(resultado).toBe(claveEsperada);
    });

    it('debería devolver "ERROR" si el nombre del ejercicio no existe en el mapa', () => {
        const nombreInvalido = 'Ejercicio inventado';

        component.ejercicio = {
            ...mockEjercicio,
            nombre: nombreInvalido
        };

        rutinaServiceSpy.buscarNombreEjercicio.and.returnValue(null);

        const resultado = component.claveEjercicioCorreccion();

        expect(resultado).toBe(NombreEjercicio.ERROR);
    });

    const mockUsuarioPremium = {
        id: 1,
        nombre: 'Leo',
        apellido: 'Vilte',
        email: 'leo@email.com',
        contraseña: '1234',
        esPremium: true,
        caloriasTotales: 0,
        altura: 175
    };

    const mockUsuarioNoPremium = {
        ...mockUsuarioPremium,
        esPremium: false
    };
    const respuestaApiUsuarioPremium = {
        exito: true,
        mensaje: 'Usuario obtenido',
        objeto: mockUsuarioPremium
    };

    const respuestaApiUsuarioNoPremium = {
        exito: true,
        mensaje: 'Usuario obtenido',
        objeto: mockUsuarioNoPremium
    };
    const datosInicialesMock = {
        rutina: rutinaMock,
        ejercicio: mockEjercicio,
        ejercicios: rutinaMock.ejercicios,
        indiceActual: 0,
        duracionDelEjercicio: '30 segundos',
        repeticionesDelEjercicio: '10 repeticiones',
        correccionPremium: false
    };
    const usuarioMock: RespuestaApi<Usuario> = {
        exito: true,
        mensaje: 'Usuario obtenido correctamente',
        objeto: {
            id: 1,
            nombre: 'Leo',
            apellido: 'Vilte',
            email: 'leo@email.com',
            contraseña: '1234',
            esPremium: true,
            caloriasTotales: 0,
            altura: 175
        }
    };

});