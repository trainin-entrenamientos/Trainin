import { TestBed } from '@angular/core/testing';

import { PlanEntrenamientoService } from './plan-entrenamiento.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { ActualizarNivelExigenciaDTO } from '../../modelos/ActualizarNivelExigenciaDTO';
import { transition } from '@angular/animations';

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

  it('debería manejar error al no obtener planes de entrenamiento', () => {
    const idUsuario = 5;
    const errorMsg = 'Error: No se pudieron obtener planes de entrenamieto';

    service.getPlanesDeEntrenamiento(idUsuario).subscribe({
      next: () => fail('No debería haber obtenido planes'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(error.error.message).toBe(errorMsg);
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/plan/obtenerPlanes/${idUsuario}`);
    expect(req.request.method).toBe('GET');

    req.flush({ message: errorMsg }, {
      status: 404,
      statusText: 'Not Found',
    })
  })

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
    const planMock = { ejercicios: [] };
    const responseMock = { id: 1, ...planMock };

    service.crearPlanEntrenamiento(planMock).subscribe(res => {
      expect(res).toEqual(responseMock);
    });

    const req = httpMock.expectOne(`${baseUrl}/plan/crearPlan`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(planMock);
    req.flush(responseMock);
  });

  it('debería fallar al crear un plan de entrenamiento con datos inválidos', () => {
    const planInvalido = { ejercicios: [] };

    service.crearPlanEntrenamiento(planInvalido).subscribe({
      next: () => fail('Se esperaba un error, pero se recibió una respuesta exitosa'),
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/plan/crearPlan`);
    expect(req.request.method).toBe('POST');

    req.flush('Plan sin relacion con usuario valido', {
      status: 400,
      statusText: 'Bad Request'
    });
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

  it('Debería actualizar el nivel de exigencia de un plan por su id', () => {
    const idPlan = 7;
    const dto: ActualizarNivelExigenciaDTO = { nivelExigencia: 3, email: 'trainin@trainin.com' };

    service.actualizarNivelExigencia(idPlan, dto)
      .subscribe(res => expect(res).toBe('OK'));

    const req = httpMock.expectOne(
      `${baseUrl}/plan/actualizarNivelExigencia/${idPlan}`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(dto);
    expect(req.request.responseType).toBe('text');
    req.flush('OK');
  });

 /* it('Debería obtener el detalle de un plan por id de plan y id de usuario', () => {
    const idPlan = 9, idUsuario = 42;
    service.obtenerDetallePlan(idPlan, idUsuario).subscribe();

    const req = httpMock.expectOne(
      `http://localhost:5010/api/Plan/obtenerDetallePlan/${idPlan}?idUsuario=${idUsuario}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({});
  });*/

});