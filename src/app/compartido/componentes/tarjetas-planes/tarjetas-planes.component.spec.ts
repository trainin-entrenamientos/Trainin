import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetasPlanesComponent } from './tarjetas-planes.component';
import { of, throwError } from 'rxjs';
import { Component } from '@angular/core';
import { AuthService } from '../../../core/servicios/authServicio/auth.service';
import { RutinaService } from '../../../core/servicios/rutinaServicio/rutina.service';
import { LogroService } from '../../../core/servicios/logroServicio/logro.service';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Fake component para que no falle el template
@Component({
  selector: 'app-boton-trainin',
  template: '',
  standalone: false
})
class FakeBotonTraininComponent {}

describe('TarjetasPlanesComponent', () => {
  let component: TarjetasPlanesComponent;
  let fixture: ComponentFixture<TarjetasPlanesComponent>;

  const authServiceMock = {
    getEmail: jasmine.createSpy().and.returnValue('test@correo.com')
  };

  const rutinaServiceMock = {
    obtenerUltimaRutina: jasmine.createSpy().and.returnValue(
      of({ objeto: { id: 1, tipoEntrenamiento: 'Fuerza', calorias: 100, tiempo: 1800, fechaRealizacion: new Date(), estado: 'Completada', foto: '' } })
    )
  };

  const logroServiceMock = {
    obtenerLogrosPorUsuario: jasmine.createSpy().and.returnValue(
      of({ objeto: [{ id: 1, nombre: 'Logro 1', descripcion: '', imagen: '', obtenido: true, tipo: '', fechaObtencion: new Date() }] })
    )
  };

  const toastrMock = {
    error: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TarjetasPlanesComponent,
        FakeBotonTraininComponent // Declaramos el componente fake
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: RutinaService, useValue: rutinaServiceMock },
        { provide: LogroService, useValue: logroServiceMock },
        { provide: ToastrService, useValue: toastrMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Usamos el CUSTOM_ELEMENTS_SCHEMA para suprimir el error
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetasPlanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a obtenerUltimaRutina y obtenerLogros en ngOnInit', () => {
    expect(authServiceMock.getEmail).toHaveBeenCalled();
    expect(rutinaServiceMock.obtenerUltimaRutina).toHaveBeenCalledWith('test@correo.com');
    expect(logroServiceMock.obtenerLogrosPorUsuario).toHaveBeenCalledWith('test@correo.com');
  });

  it('debería actualizar cantidadLogros según la respuesta', (done) => {
    logroServiceMock.obtenerLogrosPorUsuario.and.returnValue(
      of({ objeto: [{ id: 1, nombre: 'Logro 1', descripcion: '', imagen: '', obtenido: true, tipo: '', fechaObtencion: new Date() }] })
    );
    component.obtenerLogros('test@correo.com');
    fixture.detectChanges();
    setTimeout(() => {
      expect(component.cantidadLogros).toBe(1);
      done();
    }, 0);
  });

  it('debería poner tieneRutina=false cuando no hay rutina', () => {
    rutinaServiceMock.obtenerUltimaRutina.and.returnValue(of({ objeto: null }));
    component.obtenerUltimaRutina('test@correo.com');
    expect(component.tieneRutina).toBeFalse();
  });

  it('debería manejar error en obtenerUltimaRutina y llamar a toastr.error', () => {
    rutinaServiceMock.obtenerUltimaRutina.and.returnValue(throwError({ mensaje: 'Error X' }));
    component.obtenerUltimaRutina('test@correo.com');
    expect(toastrMock.error).toHaveBeenCalledWith('No existe una última rutina de entrenamiento. Error X');
  });

  it('debería manejar error en obtenerLogrosPorUsuario y llamar a toastr.error', () => {
    logroServiceMock.obtenerLogrosPorUsuario.and.returnValue(throwError({ mensaje: 'Error Y' }));
    component.obtenerLogros('test@correo.com');
    expect(toastrMock.error).toHaveBeenCalledWith('Error al obtener los logros del usuario. Error Y');
  });

  it('formatearTiempo debería devolver el formato correcto para menos de 1 hora', () => {
    const resultado = component.formatearTiempo(125); // 2min 5sec
    expect(resultado).toBe('02:05');
  });

  it('formatearTiempo debería devolver el formato correcto para más de 1 hora', () => {
    const resultado = component.formatearTiempo(3661); // 1h 1m 1s
    expect(resultado).toBe('01:01:01');
  });
});
