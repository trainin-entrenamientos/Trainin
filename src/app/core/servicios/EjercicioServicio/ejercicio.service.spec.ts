import { TestBed } from '@angular/core/testing';
import { EjercicioService } from './ejercicio.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EjercicioIncorporadoDTO } from '../../modelos/EjercicioIncorporadoDTO';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';
import { environment } from '../../../../environments/environment.prod';
import { CategoriaEjercicioDTO } from '../../modelos/CategoriaEjercicioDTO';
import { GrupoMuscularDTO } from '../../modelos/GrupoMuscularDTO';
import { EjercicioDiarioDTO } from '../../modelos/EjercicioDiarioDTO';

describe('EjercicioService', () => {
  let service: EjercicioService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.URL_BASE}/ejercicio`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EjercicioService]
    });

    service = TestBed.inject(EjercicioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('obtenerTodosLosEjercicios', () => {
    it('debería devolver una lista de ejercicios', () => {
      const respuestaMock: RespuestaApi<EjercicioIncorporadoDTO[]> = {
        exito: true,
        mensaje: 'Éxito',
        objeto: [
          { id: 1, nombre: 'Ejercicio 1', descripcion: 'Descripción 1', video: 'video1.mp4', valorMet: 10, tieneCorreccion: true, imagen: 'imagen1.jpg', correccionPremium: true, idTipoEjercicio: 1, idsGrupoMuscular: [1, 2], idsCategorias: [1] },
          { id: 2, nombre: 'Ejercicio 2', descripcion: 'Descripción 2', video: 'video2.mp4', valorMet: 20, tieneCorreccion: false, imagen: 'imagen2.jpg', correccionPremium: false, idTipoEjercicio: 2, idsGrupoMuscular: [2], idsCategorias: [2] }
        ]
      };

      service.obtenerTodosLosEjercicios().subscribe(response => {
        expect(response.objeto.length).toBeGreaterThan(0);
        expect(response.objeto[0].nombre).toBe('Ejercicio 1');
      });

      const req = httpMock.expectOne(`${apiUrl}/obtener`);
      expect(req.request.method).toBe('GET');
      req.flush(respuestaMock);
    });
  });

  describe('obtenerEjercicioPorId', () => {
    it('debería devolver un ejercicio por su ID', () => {
      const respuestaMock: RespuestaApi<EjercicioIncorporadoDTO> = {
        exito: true,
        mensaje: 'Éxito',
        objeto: { id: 1, nombre: 'Ejercicio 1', descripcion: 'Descripción 1', video: 'video1.mp4', valorMet: 10, tieneCorreccion: true, imagen: 'imagen1.jpg', correccionPremium: true, idTipoEjercicio: 1, idsGrupoMuscular: [1, 2], idsCategorias: [1] }
      };

      service.obtenerEjercicioPorId(1).subscribe(response => {
        expect(response.objeto.nombre).toBe('Ejercicio 1');
        expect(response.objeto.id).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/obtener/1`);
      expect(req.request.method).toBe('GET');
      req.flush(respuestaMock);
    });
  });

  describe('crearEjercicio', () => {
    it('debería crear un nuevo ejercicio', () => {
      const respuestaMock: RespuestaApi<string> = {
        exito: true,
        mensaje: 'Ejercicio creado',
        objeto: 'Success'
      };

      const nuevoEjercicio: EjercicioIncorporadoDTO = { id: 3, nombre: 'Ejercicio 3', descripcion: 'Descripción 3', video: 'video3.mp4', valorMet: 15, tieneCorreccion: true, imagen: 'imagen3.jpg', correccionPremium: false, idTipoEjercicio: 1, idsGrupoMuscular: [1], idsCategorias: [1] };

      service.crearEjercicio(nuevoEjercicio).subscribe(response => {
        expect(response.mensaje).toBe('Ejercicio creado');
      });

      const req = httpMock.expectOne(`${apiUrl}/agregar`);
      expect(req.request.method).toBe('POST');
      req.flush(respuestaMock);
    });
  });

  describe('editarEjercicio', () => {
    it('debería editar un ejercicio existente', () => {
      const respuestaMock: RespuestaApi<string> = {
        exito: true,
        mensaje: 'Ejercicio editado',
        objeto: 'Success'
      };

      const ejercicioEditado: EjercicioIncorporadoDTO = { id: 1, nombre: 'Ejercicio 1 Editado', descripcion: 'Descripción 1 Editada', video: 'video1_editado.mp4', valorMet: 12, tieneCorreccion: true, imagen: 'imagen1_editada.jpg', correccionPremium: true, idTipoEjercicio: 1, idsGrupoMuscular: [1, 2], idsCategorias: [1] };

      service.editarEjercicio(1, ejercicioEditado).subscribe(response => {
        expect(response.mensaje).toBe('Ejercicio editado');
      });

      const req = httpMock.expectOne(`${apiUrl}/editar`);
      expect(req.request.method).toBe('PATCH');
      req.flush(respuestaMock);
    });
  });

  describe('eliminarEjercicio', () => {
    it('debería eliminar un ejercicio por su ID', () => {
      const respuestaMock: RespuestaApi<string> = {
        exito: true,
        mensaje: 'Ejercicio eliminado',
        objeto: 'Success'
      };

      service.eliminarEjercicio(1).subscribe(response => {
        expect(response.mensaje).toBe('Ejercicio eliminado');
      });

      const req = httpMock.expectOne(`${apiUrl}/eliminar/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(respuestaMock);
    });
  });

  describe('obtenerCategorias', () => {
    it('debería devolver una lista de categorías de ejercicios', () => {
      const respuestaMock: RespuestaApi<CategoriaEjercicioDTO[]> = {
        exito: true,
        mensaje: 'Éxito',
        objeto: [{ id: 1, descripcion: 'Categoría 1', nombre: 'Categoría 1', imagen: 'imagen_categoria1.jpg' }]
      };

      service.obtenerCategorias().subscribe(response => {
        expect(response.objeto.length).toBeGreaterThan(0);
        expect(response.objeto[0].nombre).toBe('Categoría 1');
      });

      const req = httpMock.expectOne(`${apiUrl}/obtenerCategorias`);
      expect(req.request.method).toBe('GET');
      req.flush(respuestaMock);
    });
  });

  describe('obtenerGruposMusculares', () => {
    it('debería devolver una lista de grupos musculares', () => {
      const respuestaMock: RespuestaApi<GrupoMuscularDTO[]> = {
        exito: true,
        mensaje: 'Éxito',
        objeto: [{ id: 1, nombre: 'Grupo Muscular 1', imagen: 'imagen_grupo1.jpg' }]
      };

      service.obtenerGruposMusculares().subscribe(response => {
        expect(response.objeto.length).toBeGreaterThan(0);
        expect(response.objeto[0].nombre).toBe('Grupo Muscular 1');
      });

      const req = httpMock.expectOne(`${apiUrl}/obtenerGruposMusculares`);
      expect(req.request.method).toBe('GET');
      req.flush(respuestaMock);
    });
  });

  describe('obtenerEjercicioDiario', () => {
    it('debería devolver el ejercicio diario de un usuario', () => {
      const respuestaMock: RespuestaApi<EjercicioDiarioDTO> = {
        exito: true,
        mensaje: 'Éxito',
        objeto: { id: 1, nombre: 'Ejercicio Diario', descripcion: 'Descripción Ejercicio Diario', video: 'video_diario.mp4', imagen: 'imagen_diario.jpg', tiempo: 30, repeticiones: 3, idTipoEjercicio: 1 }
      };

      service.obtenerEjercicioDiario('test@example.com').subscribe(response => {
        expect(response.objeto.nombre).toBe('Ejercicio Diario');
        expect(response.objeto.tiempo).toBe(30);
      });

      const req = httpMock.expectOne(`${apiUrl}/diario/test@example.com`);
      expect(req.request.method).toBe('GET');
      req.flush(respuestaMock);
    });
  });

  describe('marcarEjercicioDiarioRealizado', () => {
    it('debería marcar un ejercicio diario como realizado', () => {
      const respuestaMock: RespuestaApi<string> = {
        exito: true,
        mensaje: 'Ejercicio marcado como realizado',
        objeto: 'Success'
      };

      service.marcarEjercicioDiarioRealizado('test@example.com').subscribe(response => {
        expect(response.mensaje).toBe('Ejercicio marcado como realizado');
      });

      const req = httpMock.expectOne(`${apiUrl}/DiarioCompletado/test@example.com`);
      expect(req.request.method).toBe('GET');
      req.flush(respuestaMock);
    });
  });
});
