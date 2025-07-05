import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PerfilService } from './perfil.service';
import { environment } from '../../../../environments/environment';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';
import { PerfilDTO } from '../../modelos/PerfilDTO';
import { UsuarioEditado } from '../../modelos/UsuarioEditadoDTO';
import { CambiarContraseniaDTO } from '../../modelos/CambiarContraseniaDTO';

describe('PerfilService', () => {
  let service: PerfilService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.URL_BASE}/usuario/`;

  const mockPerfil: PerfilDTO = new PerfilDTO(
    1,                          // id
    'John',                     // nombre
    'Doe',                      // apellido
    'john@example.com',         // email
    70,                         // peso
    175,                        // altura
    30,                         // edad
    new Date(),                 // fechaCreacion
    '1994-06-20',               // fechaNacimiento
    'foto.png',                 // fotoDePerfil
    2000,                       // caloriasTotales
    50,                         // entrenamientosHechos
    100,                        // tiempoTotalEntrenado
    []                          // logros (vacío)
  );

  const mockUsuarioEditado: UsuarioEditado = {
    id: 1,
    nombre: 'NuevoNombre',
    apellido: 'NuevoApellido',
    fechaNacimiento: '1990-01-01',
    altura: 180
  };

  const mockCambiarContraseniaDTO: CambiarContraseniaDTO = {
    idUsuario: 1,
    contraseniaVieja: 'oldPass',
    contraseniaNueva: 'newPass'
  };

  const mockRespuestaPerfil: RespuestaApi<PerfilDTO> = {
    exito: true,
    mensaje: 'Perfil obtenido correctamente',
    objeto: mockPerfil
  };

  const mockRespuestaString: RespuestaApi<string> = {
    exito: true,
    mensaje: 'Operación exitosa',
    objeto: 'OK'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PerfilService]
    });
    service = TestBed.inject(PerfilService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('getPerfil', () => {
    it('debería hacer GET al endpoint correcto y devolver el perfil', () => {
      const email = 'john@example.com';
      service.getPerfil(email).subscribe(res => {
        expect(res).toEqual(mockRespuestaPerfil);
      });

      const req = httpMock.expectOne(`${apiUrl}perfil/${encodeURIComponent(email)}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRespuestaPerfil);
    });
  });

  describe('actualizarFotoPerfil', () => {
    it('debería hacer PATCH al endpoint correcto con los datos correctos', () => {
      const email = 'john@example.com';
      const fotoBase64 = 'data:image/png;base64,abc123';

      service.actualizarFotoPerfil(email, fotoBase64).subscribe(res => {
        expect(res).toEqual(mockRespuestaString);
      });

      const req = httpMock.expectOne(`${apiUrl}actualizarFoto/`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ email, fotoBase64 });
      req.flush(mockRespuestaString);
    });
  });

  describe('editarPerfil', () => {
    it('debería hacer PATCH al endpoint correcto con el usuario editado', () => {
      service.editarPerfil(mockUsuarioEditado).subscribe(res => {
        expect(res).toEqual(mockRespuestaString);
      });

      const req = httpMock.expectOne(`${apiUrl}editar`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockUsuarioEditado);
      req.flush(mockRespuestaString);
    });
  });

  describe('cambiarContrasenia', () => {
    it('debería hacer PATCH al endpoint correcto con el dto', () => {
      service.cambiarContrasenia(mockCambiarContraseniaDTO).subscribe(res => {
        expect(res).toEqual(mockRespuestaString);
      });

      const req = httpMock.expectOne(`${apiUrl}cambiarContrasenia`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockCambiarContraseniaDTO);
      req.flush(mockRespuestaString);
    });
  });
});