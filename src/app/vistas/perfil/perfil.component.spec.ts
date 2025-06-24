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
    const perfilPayload = {
      objeto: {
        nombre: 'Usuario Test',
        fotoDePerfil: '',
        apellido: '',
        fechaNacimiento: '2000-01-01',
        altura: 1.70,
        peso: 70,
        edad: 25,
        caloriasTotales: 1500,
        logros: []
      }
    };

    authServiceSpy.getEmail.and.returnValue('test@test.com');
    perfilServiceSpy.getPerfil.and.returnValue(of(perfilPayload));

    component.ngOnInit();

    expect(authServiceSpy.getEmail).toHaveBeenCalled();
    expect(perfilServiceSpy.getPerfil).toHaveBeenCalledWith('test@test.com');
    expect(component.perfil?.nombre).toBe('Usuario Test');
    expect(component.fotoMostrar).toBe('');  // dado fotoDePerfil=''
    expect(component.logros).toEqual([]);
  });

  describe('onFileSelected', () => {
    it('debe leer el fichero, llamar a actualizarFotoPerfil y mostrar toast de éxito', () => {
      component.email = 'a@b.com';
      perfilServiceSpy.actualizarFotoPerfil.and.returnValue(of({ message: '¡Listo!' }));

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
        .toHaveBeenCalledWith('Error al actualizar la foto');
    });
  });
});
