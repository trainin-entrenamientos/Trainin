import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlanEntrenamientoService } from './plan-entrenamiento.service';
import { environment } from '../../../../environments/environment';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';
import { PlanEntrenamiento } from '../../modelos/PlanEntrenamiento';
import { CategoriaEjercicioDTO } from '../../modelos/CategoriaEjercicioDTO';
import { EquipamientoDTO } from '../../modelos/EquipamentoDTO';
import { PlanCreadoDTO } from '../../modelos/PlanCreadoDTO';
import { PlanCompleto } from '../../modelos/DetallePlanDTO';
import { HistorialPlanDTO } from '../../modelos/HistorialPlanDTO';
import { ActualizarNivelExigenciaDTO } from '../../modelos/ActualizarNivelExigenciaDTO';

describe('PlanEntrenamientoService', () => {
  let service: PlanEntrenamientoService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.URL_BASE;

  const mockPlan = new PlanEntrenamiento(
    1, 'Plan 1', true, 5, 50, 10, 3, 20, 100
  );

  const mockCategoria: CategoriaEjercicioDTO = {
    id: 1,
    descripcion: 'Desc',
    nombre: 'Fuerza',
    imagen: 'fuerza.png'
  };

  const mockEquipamiento: EquipamientoDTO = {
    id: 1,
    descripcion: 'Mancuerna',
    imagen: 'mancuerna.png'
  };

  const mockPlanCreado: PlanCreadoDTO = {
    planId: 123
  };

  const mockPlanCompleto: PlanCompleto = {
    id: 1,
    nombre: 'Plan Completo',
    descripcion: 'Desc',
    nivelExigencia: 3,
    duracionSemanas: 4,
    calorias: 1000,
    ejercicios: [],
  } as unknown as PlanCompleto;

  const mockHistorialPlan: HistorialPlanDTO = {
    id: 1,
    tipoEntrenamiento: 'Cardio',
    foto: 'foto.png',
    calorias: 300,
    tiempo: 45,
    fechaRealizacion: new Date()
  };

  const mockRespuestaPlanes: RespuestaApi<PlanEntrenamiento[]> = {
    exito: true,
    mensaje: 'OK',
    objeto: [mockPlan]
  };

  const mockRespuestaCategorias: RespuestaApi<CategoriaEjercicioDTO[]> = {
    exito: true,
    mensaje: 'OK',
    objeto: [mockCategoria]
  };

  const mockRespuestaEquipamiento: RespuestaApi<EquipamientoDTO[]> = {
    exito: true,
    mensaje: 'OK',
    objeto: [mockEquipamiento]
  };

  const mockRespuestaPlanCreado: RespuestaApi<PlanCreadoDTO> = {
    exito: true,
    mensaje: 'Plan creado',
    objeto: mockPlanCreado
  };

  const mockRespuestaString: RespuestaApi<string> = {
    exito: true,
    mensaje: 'Operación exitosa',
    objeto: 'OK'
  };

  const mockRespuestaDetalle: RespuestaApi<PlanCompleto> = {
    exito: true,
    mensaje: 'OK',
    objeto: mockPlanCompleto
  };

  const mockRespuestaHistorial: RespuestaApi<HistorialPlanDTO[]> = {
    exito: true,
    mensaje: 'OK',
    objeto: [mockHistorialPlan]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlanEntrenamientoService]
    });
    service = TestBed.inject(PlanEntrenamientoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('getPlanesDeEntrenamiento debería hacer GET y devolver planes', () => {
    service.getPlanesDeEntrenamiento(1).subscribe(res => {
      expect(res).toEqual(mockRespuestaPlanes);
    });

    const req = httpMock.expectOne(`${baseUrl}/plan/obtener/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRespuestaPlanes);
  });

  it('obtenerOpcionesEntrenamiento debería hacer GET y devolver categorías', () => {
    service.obtenerOpcionesEntrenamiento().subscribe(res => {
      expect(res).toEqual(mockRespuestaCategorias);
    });

    const req = httpMock.expectOne(`${baseUrl}/ejercicio/obtenerCategorias`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRespuestaCategorias);
  });

  it('obtenerEquipamiento debería hacer GET y devolver equipamiento', () => {
    service.obtenerEquipamiento().subscribe(res => {
      expect(res).toEqual(mockRespuestaEquipamiento);
    });

    const req = httpMock.expectOne(`${baseUrl}/ejercicio/obtenerEquipamientos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRespuestaEquipamiento);
  });

  it('crearPlanEntrenamiento debería hacer POST y devolver plan creado', () => {
    const newPlan = { nombre: 'Plan Nuevo' };

    service.crearPlanEntrenamiento(newPlan).subscribe(res => {
      expect(res).toEqual(mockRespuestaPlanCreado);
    });

    const req = httpMock.expectOne(`${baseUrl}/plan/crear`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPlan);
    req.flush(mockRespuestaPlanCreado);
  });

  it('desactivarPlanPorId debería hacer PATCH con idUsuario', () => {
    service.desactivarPlanPorId(1, 99).subscribe(res => {
      expect(res).toEqual(mockRespuestaString);
    });

    const req = httpMock.expectOne(`${baseUrl}/plan/desactivar/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ IdUsuario: 99 });
    req.flush(mockRespuestaString);
  });

  it('actualizarNivelExigencia debería hacer PATCH con formulario', () => {
    const dto: ActualizarNivelExigenciaDTO = { nivelExigencia: 3, email: 'user@example.com' };

    service.actualizarNivelExigencia(1, dto).subscribe(res => {
      expect(res).toEqual(mockRespuestaString);
    });

    const req = httpMock.expectOne(`${baseUrl}/plan/actualizar/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(dto);
    req.flush(mockRespuestaString);
  });

  it('obtenerDetallePlan debería hacer GET y devolver detalle', () => {
    service.obtenerDetallePlan(1, 99).subscribe(res => {
      expect(res).toEqual(mockRespuestaDetalle);
    });

    const req = httpMock.expectOne(`${baseUrl}/plan/detalle/1?IdUsuario=99`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRespuestaDetalle);
  });

  it('obtenerHistorialPlanes debería hacer GET y devolver historial', () => {
    const email = 'user@example.com';

    service.obtenerHistorialPlanes(email).subscribe(res => {
      expect(res).toEqual(mockRespuestaHistorial);
    });

    const req = httpMock.expectOne(`${baseUrl}/plan/historial/${email}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRespuestaHistorial);
  });
});
