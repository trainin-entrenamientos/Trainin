import { TestBed } from '@angular/core/testing';

import { PlanEntrenamientoService } from './plan-entrenamiento.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';

describe('PlanEntrenamientoService', () => {
  let service: PlanEntrenamientoService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.URL_BASE;

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

  it('debería obtener planes de entrenamiento', () => {
    const dummyResponse = [{ id: 1, nombre: 'Plan A' }];
    const idUsuario = 5;

    service.getPlanesDeEntrenamiento(idUsuario).subscribe(planes => {
      expect(planes).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/plan/obtenerPlanes/${idUsuario}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('debería obtener opciones de entrenamiento', () => {
    const dummyOpciones = ['Fuerza', 'Cardio'];

    service.obtenerOpcionesEntrenamiento().subscribe(data => {
      expect(data).toEqual(dummyOpciones);
    });

    const req = httpMock.expectOne(`${baseUrl}/categoriaejercicio/obtenerCategorias`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyOpciones);
  });

  it('debería obtener objetivos', () => {
    const dummyObjetivos = ['Perder peso', 'Ganar masa'];
    const url = 'http://localhost:5010/api/categoriaejercicio/obtenerObjetivos';

    service.obtenerObjetivos().subscribe(data => {
      expect(data).toEqual(dummyObjetivos);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(dummyObjetivos);
  });

  it('debería obtener equipamiento', () => {
    const dummyEquipos = ['Mancuernas', 'Banda elástica'];

    service.obtenerEquipamiento().subscribe(data => {
      expect(data).toEqual(dummyEquipos);
    });

    const req = httpMock.expectOne(`${baseUrl}/equipamiento/obtenerEquipamientos`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEquipos);
  });

  it('debería crear un plan de entrenamiento', () => {
    const planMock = { nombre: 'Plan nuevo', ejercicios: [] };
    const responseMock = { id: 1, ...planMock };

    service.crearPlanEntrenamiento(planMock).subscribe(res => {
      expect(res).toEqual(responseMock);
    });

    const req = httpMock.expectOne(`${baseUrl}/plan/crearPlan`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(planMock);
    req.flush(responseMock);
  });

  it('debería desactivar un plan por ID', () => {
    const idPlan = 1;
    const idUsuario = 99;
    const responseMock = { success: true };

    service.desactivarPlanPorId(idPlan, idUsuario).subscribe(res => {
      expect(res).toEqual(responseMock);
    });

    const req = httpMock.expectOne(`${baseUrl}/plan/desactivarPlan/${idPlan}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ idUsuario });
    req.flush(responseMock);
  });
});
