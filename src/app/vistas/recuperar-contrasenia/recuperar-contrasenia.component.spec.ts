import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RecuperarContraseniaComponent } from './recuperar-contrasenia.component';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { ToastrService } from 'ngx-toastr';

describe('RecuperarContraseniaComponent', () => {
  let component: RecuperarContraseniaComponent;
  let fixture: ComponentFixture<RecuperarContraseniaComponent>;
  let usuarioSpy: jasmine.SpyObj<UsuarioService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeStub: any;

  beforeEach(async () => {
    usuarioSpy = jasmine.createSpyObj('UsuarioService', ['reestablecerContrasenia']);
    toastrSpy  = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    routerSpy   = jasmine.createSpyObj('Router', ['navigate']);
    routeStub   = {
      snapshot: {
        paramMap: {
          get: (key: string) => key === 'token' ? 'abc' : 'trainin@trainin.com'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RecuperarContraseniaComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: ToastrService,  useValue: toastrSpy  },
        { provide: Router,         useValue: routerSpy   },
        { provide: ActivatedRoute, useValue: routeStub   },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarContraseniaComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('Debería crear el formulario con los campos requeridos', () => {
    expect(component.form.contains('nuevaContrasenia')).toBeTrue();
    expect(component.form.contains('repetirContrasenia')).toBeTrue();
  });

  it('Debería detener el envío y marcar todos los campos si faltan datos', () => {
    spyOn(component.form, 'markAllAsTouched');
    component.onSubmit();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
    expect(usuarioSpy.reestablecerContrasenia).not.toHaveBeenCalled();
  });

  it('Debería detectar cuando las contraseñas no coinciden', () => {
    component.form.setValue({
      nuevaContrasenia: 'Abc123!',
      repetirContrasenia: 'Xyz987@'
    });
    expect(component.form.errors).toEqual({ contrasenasNoCoinciden: true });
  });

  it('Debería mostrar éxito y programar el regreso cuando la actualización sale bien', fakeAsync(() => {
    usuarioSpy.reestablecerContrasenia.and.returnValue(of({ exito: true } as any));
    component.form.setValue({
      nuevaContrasenia: 'Abc123!',
      repetirContrasenia: 'Abc123!'
    });

    component.onSubmit();
    tick();
    expect(component.cargando).toBeFalse();
    expect(toastrSpy.success)
      .toHaveBeenCalledWith('Contraseña actualizada. Ya podés iniciar sesión');

    tick(3000);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/iniciar-sesion']);
  }));

  it('Debería mostrar error cuando la respuesta es negativa', fakeAsync(() => {
    usuarioSpy.reestablecerContrasenia.and.returnValue(of({ exito: false } as any));
    component.form.setValue({
      nuevaContrasenia: 'Abc123!',
      repetirContrasenia: 'Abc123!'
    });

    component.onSubmit();
    tick();
    expect(toastrSpy.error)
      .toHaveBeenCalledWith('Error no se pudo actualizar la contraseña');
    expect(component.cargando).toBeFalse();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));

  it('Debería redirigir a iniciar sesión con mensaje de error cuando falla la petición', fakeAsync(() => {
    usuarioSpy.reestablecerContrasenia.and.returnValue(throwError(() => new Error()));
    component.form.setValue({
      nuevaContrasenia: 'Abc123!',
      repetirContrasenia: 'Abc123!'
    });

    component.onSubmit();
    tick();
    expect(toastrSpy.error)
      .toHaveBeenCalledWith('Ocurrió un error reestableciendo la contraseña');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/iniciar-sesion']);
    expect(component.cargando).toBeFalse();
  }));
});