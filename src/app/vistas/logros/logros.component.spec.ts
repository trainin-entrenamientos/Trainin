import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LogrosComponent } from './logros.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError, Subject } from 'rxjs';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { Logro } from '../../core/modelos/LogroDTO';


const logrosMock: Logro[] = [
  { id: 1, nombre: 'Logro 1', descripcion: 'Desc 1', imagen: 'img1.png', obtenido: true, fecha_obtencion: new Date() },
  { id: 2, nombre: 'Logro 2', descripcion: 'Desc 2', imagen: 'img2.png', obtenido: false, fecha_obtencion: new Date() },
  { id: 3, nombre: 'Logro 3', descripcion: 'Desc 3', imagen: 'img3.png', obtenido: true, fecha_obtencion: new Date() },
  { id: 4, nombre: 'Logro 4', descripcion: 'Desc 4', imagen: 'img4.png', obtenido: false, fecha_obtencion: new Date() },

];

describe('LogrosComponent', () => {
  let component: LogrosComponent;
  let fixture: ComponentFixture<LogrosComponent>;
  let logroServiceSpy: jasmine.SpyObj<LogroService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const logroSpy = jasmine.createSpyObj('LogroService', ['obtenerLogrosPorUsuario', 'obtenerTodosLosLogros']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getEmail']);

    await TestBed.configureTestingModule({
      declarations: [LogrosComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: LogroService, useValue: logroSpy },
        { provide: AuthService, useValue: authSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogrosComponent);
    component = fixture.componentInstance;
    logroServiceSpy = TestBed.inject(LogroService) as jasmine.SpyObj<LogroService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('debería inicializar con email y cargar logros correctamente', () => {
    const email = 'test@mail.com';
    const logrosUsuario = { logros: [{ id: 1 }, { id: 2 }] };
    const todosLogros = { logros: [{ id: 1 }, { id: 2 }, { id: 3 }] };

    dadoQueElEmailEs(email);
    dadoQueElServicioDevuelveLogrosPorUsuario(logrosUsuario);
    dadoQueElServicioDevuelveTodosLosLogros(todosLogros);

    cuandoSeInicializaElComponente();

    entoncesElEmailDelComponenteEs(email);
    entoncesSeLlamanLosServiciosDeLogrosConElEmail(email);
    entoncesLosLogrosSeSeteanCorrectamente();
    entoncesElFiltroPredeterminadoEsTodos();
  });

  it('debería manejar error si no encuentra email', () => {
    dadoQueElEmailEs(null);
    spyOn(console, 'error');

    cuandoSeInicializaElComponente();

    expect(console.error).toHaveBeenCalledWith('No se encontró el email del usuario');
  });

  it('debería manejar error en obtener logros por usuario si no se obtienen los mismos', () => {
    const email = 'test@mail.com';
    dadoQueElEmailEs(email);
    dadoQueElServicioDevuelveErrorEnLogrosPorUsuario();
    spyOn(console, 'error');

    cuandoSeInicializaElComponente();

    expect(console.error).toHaveBeenCalledWith('Error al obtener los logros del usuario:', jasmine.any(Error));
  });

  it('debería manejar error en obtener todos los logros si no se obtienen los mismos', () => {
    const email = 'test@mail.com';
    const logrosUsuario = logrosMock;
    dadoQueElEmailEs(email);
    dadoQueElServicioDevuelveLogrosPorUsuario(logrosUsuario);
    dadoQueElServicioDevuelveErrorEnTodosLosLogros();
    spyOn(console, 'error');

    cuandoSeInicializaElComponente();

    expect(console.error).toHaveBeenCalledWith('Error al obtener todos los logros:', jasmine.any(Error));
  });

  it('debería aplicar filtro "obtenidos" correctamente', () => {
    component.todosLosLogros = logrosMock;

    component.cambiarFiltro('obtenidos');

    expect(component.filtroActivo).toBe('obtenidos');
    expect(component.logrosFiltrados.length).toBe(2);
    expect(component.logrosFiltrados.every(l => l.obtenido)).toBeTrue();
  });

  it('debería aplicar filtro "faltantes" correctamente', () => {
    component.todosLosLogros = logrosMock;

    component.cambiarFiltro('faltantes');

    expect(component.filtroActivo).toBe('faltantes');
    expect(component.logrosFiltrados.length).toBe(2);
    expect(component.logrosFiltrados.every(l => !l.obtenido)).toBeTrue();
  });

  it('debería aplicar filtro "todos" y ordenar con obtenidos primero', () => {
    component.todosLosLogros = logrosMock;

    component.cambiarFiltro('todos');

    expect(component.filtroActivo).toBe('todos');
    expect(component.logrosFiltrados.length).toBe(4);
    expect(component.logrosFiltrados[0].obtenido).toBeTrue();
  });


  
  function dadoQueElEmailEs(email: string | null) {
    authServiceSpy.getEmail.and.returnValue(email);
  }

  function dadoQueElServicioDevuelveLogrosPorUsuario(logros: any) {
    logroServiceSpy.obtenerLogrosPorUsuario.and.returnValue(of(logros));
  }

  function dadoQueElServicioDevuelveTodosLosLogros(logros: any) {
    logroServiceSpy.obtenerTodosLosLogros.and.returnValue(of(logros));
  }

  function dadoQueElServicioDevuelveErrorEnLogrosPorUsuario() {
    logroServiceSpy.obtenerLogrosPorUsuario.and.returnValue(throwError(() => new Error('Error usuario')));
  }

  function dadoQueElServicioDevuelveErrorEnTodosLosLogros() {
    logroServiceSpy.obtenerTodosLosLogros.and.returnValue(throwError(() => new Error('Error todos')));
  }

  function cuandoSeInicializaElComponente() {
    component.ngOnInit();
  }

  function entoncesElEmailDelComponenteEs(email: string | null) {
    expect(component.email).toBe(email);
  }

  function entoncesSeLlamanLosServiciosDeLogrosConElEmail(email: string) {
    expect(logroServiceSpy.obtenerLogrosPorUsuario).toHaveBeenCalledWith(email);
    expect(logroServiceSpy.obtenerTodosLosLogros).toHaveBeenCalled();
  }

  function entoncesLosLogrosSeSeteanCorrectamente() {
    expect(component.logrosObtenidos.length).toBeGreaterThan(0);
    expect(component.todosLosLogros.length).toBeGreaterThan(0);
    expect(component.logrosFiltrados.length).toBeGreaterThan(0);
  }

  function entoncesElFiltroPredeterminadoEsTodos() {
    expect(component.filtroActivo).toBe('todos');
  }

});
