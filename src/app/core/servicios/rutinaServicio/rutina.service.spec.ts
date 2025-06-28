import { TestBed } from '@angular/core/testing';
import { RutinaService } from './rutina.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { Rutina, Ejercicio } from '../../modelos/RutinaDTO';
import { HistorialPlanDTO } from '../../modelos/HistorialPlanDTO';
import { LogroDTO } from '../../modelos/LogroDTO';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';
import { NombreEjercicio } from '../../../compartido/enums/nombre-ejercicio.enum';

describe('RutinaService', () => {
  let service: RutinaService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.URL_BASE;

  const mockEjercicio: Ejercicio = {
    id: 1,
    nombre: 'Press militar',
    descripcion: 'Hombros',
    duracion: 60,
    repeticiones: 10,
    correccionPremium: true,
    series: null,
    imagen: '',
    video: '',
    tieneCorrecion: false,
    categoria: [],
    grupoMuscular: [],
    tipoEjercicio: ''
  };

  const mockRutina: Rutina = {
    id: 1,
    numeroRutina: 1,
    duracionEstimada: 600,
    nombre: 'Rutina 1',
    ejercicios: [mockEjercicio],
    categoriaEjercicio: 'Fuerza',
    rutinasRealizadas: 5,
    caloriasQuemadas: 300,
    numeroDeRutinaSemanal: 1,
    cantidadDeRutinasTotales: 10,
    cantidadDeRutinasPorSemana: 3
  };

  const mockHistorial: HistorialPlanDTO = {
    id: 1,
    tipoEntrenamiento: 'Cardio',
    foto: 'foto.png',
    calorias: 300,
    tiempo: 45,
    fechaRealizacion: new Date()
  };

  const mockLogro: LogroDTO = {
    id: 1,
    nombre: 'Primer Logro',
    descripcion: 'Desc',
    imagen: 'logro.png',
    obtenido: true,
    tipo: 'Meta',
    fechaObtencion: new Date()
  };

  const mockRespuestaRutina: RespuestaApi<Rutina> = {
    exito: true,
    mensaje: 'OK',
    objeto: mockRutina
  };

  const mockRespuestaHistorial: RespuestaApi<HistorialPlanDTO> = {
    exito: true,
    mensaje: 'OK',
    objeto: mockHistorial
  };

  const mockRespuestaLogro: RespuestaApi<LogroDTO> = {
    exito: true,
    mensaje: 'OK',
    objeto: mockLogro
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RutinaService);
    httpMock = TestBed.inject(HttpTestingController);

    sessionStorage.clear(); // limpiar antes de cada test
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('getDetalleEjercicios debería hacer GET y devolver rutina', () => {
    service.getDetalleEjercicios(1).subscribe(res => {
      expect(res).toEqual(mockRespuestaRutina);
    });

    const req = httpMock.expectOne(`${baseUrl}/rutina/obtener/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRespuestaRutina);
  });

  it('obtenerUltimaRutina debería hacer GET y devolver historial', () => {
    service.obtenerUltimaRutina('user@example.com').subscribe(res => {
      expect(res).toEqual(mockRespuestaHistorial);
    });

    const req = httpMock.expectOne(`${baseUrl}/rutina/ultimaRealizada/user@example.com`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRespuestaHistorial);
  });

  it('fueRealizada debería hacer PATCH y devolver logro', () => {
    service.fueRealizada(1, 'user@example.com', 120).subscribe(res => {
      expect(res).toEqual(mockRespuestaLogro);
    });

    const req = httpMock.expectOne(`${baseUrl}/rutina/realizada/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ email: 'user@example.com', segundosTotales: 120 });
    req.flush(mockRespuestaLogro);
  });

  it('setRutina y getRutina deberían guardar y devolver la rutina', () => {
    service.setRutina(mockRutina);
    const rutina = service.getRutina();
    expect(rutina).toEqual(mockRutina);
    expect(JSON.parse(sessionStorage.getItem('rutina')!)).toEqual(mockRutina);
  });

  it('cargarDesdeSession debería cargar rutina e índice', () => {
    sessionStorage.setItem('rutina', JSON.stringify(mockRutina));
    sessionStorage.setItem('indiceActual', '2');

    service.cargarDesdeSession();

    expect(service.getRutina()).toEqual(mockRutina);
    expect(service.getIndiceActual()).toBe(2);
  });

  it('limpiarRutina debería limpiar todo', () => {
    service.setRutina(mockRutina);
    service.setIndiceActual(1);

    service.limpiarRutina();

    expect(service.getRutina()).toBeNull();
    expect(service.getIndiceActual()).toBe(0);
    expect(sessionStorage.getItem('rutina')).toBeNull();
    expect(sessionStorage.getItem('indiceActual')).toBeNull();
  });

  it('setIndiceActual y getIndiceActual deberían guardar y devolver el índice', () => {
    service.setIndiceActual(3);
    expect(service.getIndiceActual()).toBe(3);
    expect(sessionStorage.getItem('indiceActual')).toBe('3');
  });

  it('avanzarAlSiguienteEjercicio debería incrementar índice', () => {
    service.setRutina(mockRutina);
    service.setIndiceActual(0);
    service.avanzarAlSiguienteEjercicio();
    expect(service.getIndiceActual()).toBe(1);
  });

  it('getEjercicioActual debería devolver el ejercicio correcto', () => {
    service.setRutina(mockRutina);
    service.setIndiceActual(0);
    const ejercicio = service.getEjercicioActual();
    expect(ejercicio).toEqual(mockEjercicio);
  });

  it('haySiguienteEjercicio debería devolver true cuando hay más ejercicios', () => {
    service.setRutina(mockRutina);
    service.setIndiceActual(0);
    expect(service.haySiguienteEjercicio()).toBeTrue();
  });

  it('getDatosIniciales debería devolver datos correctos', () => {
    service.setRutina(mockRutina);
    service.setIndiceActual(0);
    const datos = service.getDatosIniciales();

    expect(datos.ejercicio).toEqual(mockEjercicio);
    expect(datos.duracionDelEjercicio).toBe('60 segundos');
    expect(datos.repeticionesDelEjercicio).toBe('10 repeticiones');
    expect(datos.correccionPremium).toBeTrue();
  });

  it('buscarNombreEjercicio debería mapear nombres conocidos', () => {
    expect(service.buscarNombreEjercicio('Press militar')).toBe(NombreEjercicio.PRESS_MILITAR);
    expect(service.buscarNombreEjercicio('Sentadillas')).toBe(NombreEjercicio.SENTADILLA);
  });

  it('buscarNombreEjercicio debería devolver null para nombres desconocidos', () => {
    expect(service.buscarNombreEjercicio('Inexistente')).toBeNull();
  });
});
