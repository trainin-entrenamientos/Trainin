import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LogrosComponent } from './logros.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LogrosComponent', () => {
  let component: LogrosComponent;
  let fixture: ComponentFixture<LogrosComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let logroServiceSpy: jasmine.SpyObj<LogroService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getEmail']);
    logroServiceSpy = jasmine.createSpyObj('LogroService', [
      'obtenerLogrosPorUsuario',
      'obtenerTodosLosLogros',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    await TestBed.configureTestingModule({
      declarations: [LogrosComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: LogroService, useValue: logroServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogrosComponent);
    component = fixture.componentInstance;
  });

  it('debería cargar logros correctamente (camino feliz)', fakeAsync(() => {
    const emailMock = 'usuario@test.com';
    const obtenidos = [
      {
        id: 1,
        nombre: 'A',
        descripcion: '',
        imagen: '',
        obtenido: true,
        tipo: '',
        fechaObtencion: new Date(),
      },
    ];
    const todos = [
      {
        id: 1,
        nombre: 'A',
        descripcion: '',
        imagen: '',
        obtenido: false,
        tipo: '',
        fechaObtencion: new Date(),
      },
      {
        id: 2,
        nombre: 'B',
        descripcion: '',
        imagen: '',
        obtenido: false,
        tipo: '',
        fechaObtencion: new Date(),
      },
    ];

    authServiceSpy.getEmail.and.returnValue(emailMock);
    logroServiceSpy.obtenerLogrosPorUsuario.and.returnValue(
      of({
        exito: true,
        mensaje: 'Logros obtenidos',
        objeto: obtenidos,
      })
    );

    logroServiceSpy.obtenerTodosLosLogros.and.returnValue(
      of({
        exito: true,
        mensaje: 'Todos los logros',
        objeto: todos,
      })
    );

    fixture.detectChanges();
    tick();

    expect(component.email).toBe(emailMock);
    expect(component.todosLosLogros.length).toBe(2);
    expect(component.logrosObtenidos.length).toBe(1);
    expect(component.cargando).toBeFalse();
    expect(component.logrosFiltrados.length).toBe(2); // porque filtro es 'todos'
  }));

  it('debería manejar falta de email (camino triste)', () => {
    authServiceSpy.getEmail.and.returnValue(null);
    component.ngOnInit();

    expect(toastrSpy.error).toHaveBeenCalledWith(
      'No se pudo obtener el email del usuario'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/planes']);
  });

  it('debería manejar error al obtener logros del usuario', fakeAsync(() => {
    authServiceSpy.getEmail.and.returnValue('usuario@test.com');
    logroServiceSpy.obtenerLogrosPorUsuario.and.returnValue(
      throwError(() => new Error('Error'))
    );

    fixture.detectChanges();
    tick();

    expect(toastrSpy.error).toHaveBeenCalledWith('Error al obtener tus logros');
    expect(component.cargando).toBeFalse();
  }));

  it('debería manejar error al obtener todos los logros', fakeAsync(() => {
    authServiceSpy.getEmail.and.returnValue('usuario@test.com');
    logroServiceSpy.obtenerLogrosPorUsuario.and.returnValue(
      of({
        exito: true,
        mensaje: 'Sin logros',
        objeto: [],
      })
    );
    logroServiceSpy.obtenerTodosLosLogros.and.returnValue(
      throwError(() => new Error('Error'))
    );

    fixture.detectChanges();
    tick();

    expect(toastrSpy.error).toHaveBeenCalledWith(
      'Error al obtener todos los logros'
    );
  }));

  it('debería aplicar filtro correctamente: obtenidos', () => {
    component.todosLosLogros = [
      {
        id: 1,
        nombre: 'A',
        descripcion: '',
        imagen: '',
        obtenido: true,
        tipo: '',
        fechaObtencion: new Date(),
      },
      {
        id: 2,
        nombre: 'B',
        descripcion: '',
        imagen: '',
        obtenido: false,
        tipo: '',
        fechaObtencion: new Date(),
      },
    ];
    component.filtroActivo = 'obtenidos';
    component.aplicarFiltro();

    expect(component.logrosFiltrados.length).toBe(1);
    expect(component.logrosFiltrados[0].obtenido).toBeTrue();
  });

  it('debería aplicar filtro correctamente: faltantes', () => {
    component.todosLosLogros = [
      {
        id: 1,
        nombre: 'A',
        descripcion: '',
        imagen: '',
        obtenido: true,
        tipo: '',
        fechaObtencion: new Date(),
      },
      {
        id: 2,
        nombre: 'B',
        descripcion: '',
        imagen: '',
        obtenido: false,
        tipo: '',
        fechaObtencion: new Date(),
      },
    ];
    component.filtroActivo = 'faltantes';
    component.aplicarFiltro();

    expect(component.logrosFiltrados.length).toBe(1);
    expect(component.logrosFiltrados[0].obtenido).toBeFalse();
  });

  it('debería aplicar filtro correctamente: todos (ordenados)', () => {
    component.todosLosLogros = [
      {
        id: 1,
        nombre: 'A',
        descripcion: '',
        imagen: '',
        obtenido: false,
        tipo: '',
        fechaObtencion: new Date(),
      },
      {
        id: 2,
        nombre: 'B',
        descripcion: '',
        imagen: '',
        obtenido: true,
        tipo: '',
        fechaObtencion: new Date(),
      },
    ];
    component.filtroActivo = 'todos';
    component.aplicarFiltro();

    expect(component.logrosFiltrados.length).toBe(2);
    expect(component.logrosFiltrados[0].obtenido).toBeTrue(); // debería ir primero el obtenido
  });

  it('debería cambiar el filtro y aplicarlo', () => {
    spyOn(component, 'aplicarFiltro');
    component.cambiarFiltro('obtenidos');

    expect(component.filtroActivo).toBe('obtenidos');
    expect(component.aplicarFiltro).toHaveBeenCalled();
  });

  it('parsearFecha debería retornar Date válido desde string dd/MM/yyyy', () => {
    const result = (component as any).parsearFecha('27/06/2025');
    expect(result instanceof Date).toBeTrue();
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(5); // junio = mes 5
    expect(result.getDate()).toBe(27);
  });

  it('parsearFecha debería manejar Date ya válido', () => {
    const fecha = new Date(2023, 1, 1);
    const result = (component as any).parsearFecha(fecha);
    expect(result).toEqual(fecha);
  });

  it('parsearFecha debería retornar Date actual si valor inválido', () => {
    const result = (component as any).parsearFecha('fecha-rara');
    expect(result instanceof Date).toBeTrue();
    expect(isNaN(result.getTime())).toBeFalse();
  });
});
