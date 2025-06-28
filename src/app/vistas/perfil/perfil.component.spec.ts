import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PerfilComponent } from './perfil.component';
import { PerfilService } from '../../core/servicios/perfilServicio/perfil.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RespuestaApi } from '../../core/modelos/RespuestaApiDTO';
import { PerfilDTO } from '../../core/modelos/PerfilDTO';

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
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getEmail']);
    logroServiceSpy = jasmine.createSpyObj('LogroService', ['obtenerLogrosPorUsuario']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    modalSpy = jasmine.createSpyObj('NgbModal', ['open']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PerfilComponent],
      providers: [
        { provide: PerfilService, useValue: perfilServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: LogroService, useValue: logroServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: NgbModal, useValue: modalSpy }
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
    const perfilPayload: PerfilDTO = {
      id: 1,
      nombre: 'Usuario Test',
      apellido: 'Test',
      email: 'test@test.com',
      peso: 70,
      altura: 1.70,
      edad: 25,
      fechaCreacion: new Date('2025-06-28T00:00:00Z'),
      fechaNacimiento: '2000-01-01',
      fotoDePerfil: '',
      caloriasTotales: 1500,
      entrenamientosHechos: 10,
      tiempoTotalEntrenado: 3600,
      logros: [],
      planesCompletados: [],
      ejerciciosDiariosCompletados: 5
    };

    const perfilResponse: RespuestaApi<PerfilDTO> = {
      exito: true,
      mensaje: 'OK',
      objeto: perfilPayload
    };

    authServiceSpy.getEmail.and.returnValue('test@test.com');
    perfilServiceSpy.getPerfil.and.returnValue(of(perfilResponse));

    component.ngOnInit();

    expect(authServiceSpy.getEmail).toHaveBeenCalled();
    expect(perfilServiceSpy.getPerfil).toHaveBeenCalledWith('test@test.com');
    expect(component.perfil?.nombre).toBe('Usuario Test');
    expect(component.fotoMostrar).toBe('');
    expect(component.logros).toEqual([]);
  });

  describe('onFileSelected', () => {
    it('debe leer el fichero, llamar a actualizarFotoPerfil y mostrar toast de éxito', () => {
      component.email = 'a@b.com';
      perfilServiceSpy.actualizarFotoPerfil.and.returnValue(of({
        exito: true,
        mensaje: 'OK',
        objeto: ''
        }));
      const fakeResult = 'data:image/png;base64,XYZ';
      const fakeReader: any = {
        result: null as any,
        onload: null as any,
        readAsDataURL(file: any) {
          this.result = fakeResult;
          this.onload({ target: { result: fakeResult } });
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
        .toHaveBeenCalledWith('OK', 'Foto actualizada correctamente');
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
  });
});
