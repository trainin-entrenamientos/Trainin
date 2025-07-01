import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { OlvidasteContraseniaComponent } from './olvidaste-tu-contrasenia.component';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { ToastrService } from 'ngx-toastr';

describe('OlvidasteContraseniaComponent', () => {
  let component: OlvidasteContraseniaComponent;
  let fixture: ComponentFixture<OlvidasteContraseniaComponent>;
  let usuarioSpy: jasmine.SpyObj<UsuarioService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    usuarioSpy = jasmine.createSpyObj('UsuarioService', ['olvidarContrasenia']);
    toastrSpy  = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [OlvidasteContraseniaComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: ToastrService,  useValue: toastrSpy  }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OlvidasteContraseniaComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('Debería crear el formulario con campo email', () => {
    expect(component.form.contains('email')).toBeTrue();
  });

  it('Debería no enviar la solicitud y devolver el mensaje al usuario cuando el email no es válido', () => {
    spyOn(component.form, 'markAllAsTouched');
    component.onSubmit();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
    expect(usuarioSpy.olvidarContrasenia).not.toHaveBeenCalled();
  });

  it('Debería mostrar mensaje de éxito cuando la petición es exitosa', fakeAsync(() => {
    usuarioSpy.olvidarContrasenia.and.returnValue(of({ exito: true } as any));
    component.form.setValue({ email: 'trainin@trainin.com' });

    component.onSubmit();
    tick();
    expect(component.cargando).toBeFalse();
    expect(toastrSpy.success).toHaveBeenCalledWith(
      'Si existe una cuenta, recibirás un email para recuperarla.',
      'Correo enviado'
    );
  }));

  it('Debería no mostrar nada cuando la respuesta es negativa', fakeAsync(() => {
    usuarioSpy.olvidarContrasenia.and.returnValue(of({ exito: false } as any));
    component.form.setValue({ email: 'trainin@trainin.com' });

    component.onSubmit();
    tick();
    expect(toastrSpy.success).not.toHaveBeenCalled();
    expect(component.cargando).toBeFalse();
  }));

  it('Debería mostrar error cuando falla la petición', fakeAsync(() => {
    usuarioSpy.olvidarContrasenia.and.returnValue(throwError(() => new Error()));
    component.form.setValue({ email: 'trainin@trainin.com' });

    component.onSubmit();
    tick();
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'No se pudo enviar el email. Intente nuevamente'
    );
    expect(component.cargando).toBeFalse();
  }));
});