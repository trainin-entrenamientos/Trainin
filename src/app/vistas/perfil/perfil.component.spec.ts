import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PerfilComponent } from './perfil.component';
import { PerfilService } from '../../core/servicios/perfilServicio/perfil.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { PerfilDTO } from '../../core/modelos/PerfilDTO';
import { RespuestaApi } from '../../core/modelos/RespuestaApiDTO';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let perfilServiceSpy: jasmine.SpyObj<PerfilService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let logroServiceSpy: jasmine.SpyObj<LogroService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let modalSpy: jasmine.SpyObj<NgbModal>;

  beforeEach(waitForAsync(() => {
    perfilServiceSpy = jasmine.createSpyObj('PerfilService', ['getPerfil', 'actualizarFotoPerfil']);
    authServiceSpy   = jasmine.createSpyObj('AuthService', ['getEmail']);
    logroServiceSpy  = jasmine.createSpyObj('LogroService', ['obtenerLogrosPorUsuario']);
    toastrSpy        = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    modalSpy         = jasmine.createSpyObj('NgbModal', ['open']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PerfilComponent],
      providers: [
        { provide: PerfilService, useValue: perfilServiceSpy },
        { provide: AuthService,   useValue: authServiceSpy },
        { provide: LogroService,  useValue: logroServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: NgbModal,      useValue: modalSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a getPerfil y obtener los datos del usuario', () => {
    const perfilDTO: PerfilDTO = {
      id: 1,
      nombre: 'Usuario Test',
      apellido: 'Test',
      email: 'test@test.com',
      peso: 70,
      altura: 1.70,
      edad: 25,
      fechaCreacion: new Date('2022-01-01'),
      fechaNacimiento: '2000-01-01',
      fotoDePerfil: '',
      caloriasTotales: 1500,
      entrenamientosHechos: 10,
      tiempoTotalEntrenado: 3600,
      logros: [],
      planesCompletados: []
    };

    const respuestaMock: RespuestaApi<PerfilDTO> = {
      exito: true,
      mensaje: 'Perfil obtenido correctamente',
      objeto: perfilDTO
    };

    authServiceSpy.getEmail.and.returnValue('test@test.com');
    perfilServiceSpy.getPerfil.and.returnValue(of(respuestaMock));

    component.ngOnInit();

    expect(authServiceSpy.getEmail).toHaveBeenCalled();
    expect(perfilServiceSpy.getPerfil).toHaveBeenCalledWith('test@test.com');
    expect(component.perfil?.nombre).toBe('Usuario Test');
    expect(component.fotoMostrar).toBe('');
    expect(component.logros).toEqual([]);
    expect(component.ultimosPlanesRealizados).toEqual([]);
    expect(component.cargando).toBeFalse();
  });

  it('debería redirigir si el email es null al cargar el perfil', () => {
  authServiceSpy.getEmail.and.returnValue(null);
  const routerSpy = spyOn(component['router'], 'navigate');

  component.ngOnInit();

  expect(toastrSpy.error).toHaveBeenCalledWith('No se pudo obtener el email del usuario');
  expect(routerSpy).toHaveBeenCalledWith(['/planes']);
});
it('debería abrir el modal de editar perfil y recargar perfil al cerrarlo', () => {
  const perfilMock = {
    id: 1,
    nombre: 'Test',
    apellido: 'Usuario',
    fechaNacimiento: '2000-01-01',
    altura: 1.75
  } as PerfilDTO;

  component.perfil = perfilMock;

  const modalRefMock = {
    componentInstance: {},
    closed: of(null) // Simula cerrar el modal
  };
  modalSpy.open.and.returnValue(modalRefMock as any);

  const recargaSpy = spyOn<any>(component, 'cargarPerfil');

  component.abrirEditarPerfilModal();

  expect(modalSpy.open).toHaveBeenCalled();
  expect(recargaSpy).toHaveBeenCalled();
});
it('debería abrir el modal de cambio de contraseña con id del usuario', () => {
  component.perfil = { id: 123 } as PerfilDTO;

  const modalRefMock = { componentInstance: {} as any };
  modalSpy.open.and.returnValue(modalRefMock as any);

  component.abrirCambioContraseniaModal();

  expect(modalSpy.open).toHaveBeenCalled();
  expect(modalRefMock.componentInstance.idUsuario).toBe(123);
});
it('debería redirigir a la ruta de detalle del plan con el id proporcionado', () => {
  const routerSpy = spyOn(component['router'], 'navigate');

  component.irAlDetalle(42);

  expect(routerSpy).toHaveBeenCalledWith(['/detalle-plan', 42]);
});



  describe('onFileSelected', () => {
    it('debe leer el fichero, llamar a actualizarFotoPerfil y mostrar toast de éxito', () => {
      component.email = 'a@b.com';

      const respuestaMock: RespuestaApi<string> = {
        exito: true,
        mensaje: '¡Listo!',
        objeto: ''
      };

      perfilServiceSpy.actualizarFotoPerfil.and.returnValue(of(respuestaMock));

      const fakeResult = 'data:image/png;base64,XYZ';
      const fakeReader: any = {
        result: null as any,
        onload: null as any,
        readAsDataURL(file: any) {
          this.result = fakeResult;
          this.onload();
        }
      };
      spyOn(window as any, 'FileReader').and.returnValue(fakeReader);

      const blob = new Blob([''], { type: 'image/png' });
      const file = new File([blob], 'foto.png');
      const event = { target: { files: [file] } } as unknown as Event;

      component.onFileSelected(event);

      expect(component.fotoMostrar).toBe(fakeResult);
      expect(perfilServiceSpy.actualizarFotoPerfil)
        .toHaveBeenCalledWith('a@b.com', fakeResult);
      expect(toastrSpy.success)
        .toHaveBeenCalledWith('¡Listo!', 'Foto actualizada correctamente');
    });

    it('debería mostrar toast de error si actualizarFotoPerfil falla', () => {
      component.email = 'a@b.com';

      perfilServiceSpy.actualizarFotoPerfil.and.returnValue(
        throwError(() => new Error('Falló'))
      );

      const fakeReader: any = {
        result: null as any,
        onload: null as any,
        readAsDataURL(file: any) {
          this.onload({ target: { result: 'X' } });
        }
      };
      spyOn(window as any, 'FileReader').and.returnValue(fakeReader);

      const blob = new Blob([''], { type: 'image/png' });
      const file = new File([blob], 'f.png');
      const event = { target: { files: [file] } } as unknown as Event;

      component.onFileSelected(event);

      expect(toastrSpy.error)
        .toHaveBeenCalledWith('Error al actualizar la foto de perfil');
    });
    it('no debe hacer nada si no se selecciona un archivo', () => {
  const event = { target: { files: [] } } as unknown as Event;

  const actualizarSpy = perfilServiceSpy.actualizarFotoPerfil;
  component.onFileSelected(event);

  expect(actualizarSpy).not.toHaveBeenCalled();
  });
  });
});
