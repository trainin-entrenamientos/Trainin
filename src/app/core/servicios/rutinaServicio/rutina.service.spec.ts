/*import { TestBed } from '@angular/core/testing';
import { RutinaService } from './rutina.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Rutina, Ejercicio } from '../../modelos/RutinaDTO';
import { environment } from '../../../../environments/environment';
import { NombreEjercicio } from '../../../compartido/enums/nombre-ejercicio.enum';

describe('RutinaService', () => {
  let service: RutinaService;
  let httpMock: HttpTestingController;

  const mockRutina: Rutina = {
    id: 1,
    nombre: 'Rutina Test',
    ejercicios: [
       {
        id: 1,
        nombre: 'Ejercicio 1',
        duracion: 30,
        repeticiones: 10,
        correccionPremium: true,
        series: 3,
        imagen: 'imagen1.png',
        video: 'video1.mp4',
        descripcion: 'Descripción del ejercicio 1',
        tieneCorrecion: true,
        grupoMuscular: [],
        categoria: [{ nombre: 'Fuerza' }],
        tipoEjercicio: '1' },
     {
        id: 2,
        nombre: 'Ejercicio 2',
        duracion: 20,
        repeticiones: 5,
        correccionPremium: false,
        series: 2,
        imagen: 'imagen2.png',
        video: 'video2.mp4',
        descripcion: 'Descripción del ejercicio 2',
        tieneCorrecion: false,
        grupoMuscular: [],
        categoria: [{ nombre: 'Resistencia' }],
        tipoEjercicio: '1' }
    ],
    numeroRutina: 0,
    duracionEstimada: 0,
    rutinasRealizadas:0,
    categoriaEjercicio: 'Muscular',
  caloriasQuemadas: 250,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RutinaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    service.limpiarRutina();
  });

  it('Deberia obtener detalle ejercicios', () => {
    service.getDetalleEjercicios(123).subscribe(data => {
      expect(data).toEqual(mockRutina);
    });
    const req = httpMock.expectOne(`${environment.URL_BASE}/rutina/obtenerPorPlan/123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRutina);
  });

  it('Se maneja el error al obtener detalle ejercicios', () => {
    const errorMsg = 'No se encontró la rutina';
    service.getDetalleEjercicios(999).subscribe({
      next: () => fail('La solicitud debería haber fallado'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.error).toBe(errorMsg);
      }
    });
    const req = httpMock.expectOne(`${environment.URL_BASE}/rutina/obtenerPorPlan/999`);
    expect(req.request.method).toBe('GET');
    req.flush(errorMsg, {
      status: 404,
      statusText: 'Not Found'
    });
  });


  it('Deberia llamar fueRealizada', () => {
    const response = { success: true };
    service.fueRealizada(1, 'test@email.com').subscribe(res => {
      expect(res).toEqual(response);
    });
    const req = httpMock.expectOne(`${environment.URL_BASE}/rutina/fueRealizada/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ email: 'test@email.com' });
    req.flush(response);
  });

  it('settear y obtener rutina', () => {
    service.setRutina(mockRutina);
    expect(service.getRutina()).toEqual(mockRutina);
  });

  it('deberia limpiarRutina', () => {
    service.setRutina(mockRutina);
    service.setIndiceActual(1);
    service.limpiarRutina();
    expect(service.getRutina()).toBeNull();
    expect(service.getIndiceActual()).toBe(0);
  });

  it('settear y obtener indiceActual', () => {
    service.setIndiceActual(2);
    expect(service.getIndiceActual()).toBe(2);
  });

  it('Deberia avanzar al siguiente ejercicio', () => {
    service.setRutina(mockRutina);
    service.setIndiceActual(0);
    service.avanzarAlSiguienteEjercicio();
    
    expect(service.getIndiceActual()).toBe(1);
    service.avanzarAlSiguienteEjercicio();
    expect(service.getIndiceActual()).toBe(2); 
  });

  it('Deberia obtener ejercicio actual', () => {
    service.setRutina(mockRutina);
    service.setIndiceActual(0);
    expect(service.getEjercicioActual()).toEqual(mockRutina.ejercicios[0]);
    service.setIndiceActual(1);
    expect(service.getEjercicioActual()).toEqual(mockRutina.ejercicios[1]);
    service.setIndiceActual(2);
    expect(service.getEjercicioActual()).toBeNull();
  });

  it('Verifica si haySiguienteEjercicio', () => {
    service.setRutina(mockRutina);
    service.setIndiceActual(0);
    expect(service.haySiguienteEjercicio()).toBeTrue();
    
    service.setIndiceActual(2);
    expect(service.haySiguienteEjercicio()).toBeFalse();
  });

  it('Deberia getDatosIniciales', () => {
    service.setRutina(mockRutina);
    service.setIndiceActual(0);
    const datos = service.getDatosIniciales();
    expect(datos.rutina).toEqual(mockRutina);
    expect(datos.indiceActual).toBe(0);
    expect(datos.ejercicios.length).toBe(2);
    expect(datos.ejercicio).toEqual(mockRutina.ejercicios[0]);
    expect(datos.duracionDelEjercicio).toBe('30 segundos');
    expect(datos.repeticionesDelEjercicio).toBe('10 repeticiones');
    expect(datos.correccionPremium).toBeTrue();
  });

  it('Debería cargar la rutina al cargar la sesión', () => {
    sessionStorage.setItem('rutina', JSON.stringify(mockRutina));
    sessionStorage.setItem('indiceActual', '1');

    service.cargarDesdeSession();

    expect(service.getRutina()).toEqual(mockRutina);
    expect(service.getIndiceActual()).toBe(1);
  });

  it('Debería limpiar la rutina y eliminar el sessionStorage', () => {
    service.setRutina(mockRutina);
    service.setIndiceActual(2);

    service.limpiarRutina();

    expect(service.getRutina()).toBeNull();
    expect(service.getIndiceActual()).toBe(0);
    expect(sessionStorage.getItem('rutina')).toBeNull();
    expect(sessionStorage.getItem('indiceActual')).toBeNull();
  });

  it('Debería buscar el nombre de un ejercicio y devolver su valor correspondiente', () => {
    expect(service.buscarNombreEjercicio('Press militar'))
      .toBe(NombreEjercicio.PRESS_MILITAR);
  });

  it('Debería devolver null al buscar el nombre de un ejercicio no mapeado', () => {
    expect(service.buscarNombreEjercicio('Ejercicio desconocido'))
      .toBeNull();
  });

});*/