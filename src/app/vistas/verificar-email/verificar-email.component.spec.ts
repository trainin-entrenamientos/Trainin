/*import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificarEmailComponent } from './verificar-email.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { VerificacionCorreoService } from '../../core/servicios/verificacionCorreoServicio/verificacion-correo.service';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('VerificarEmailComponent', () => {
  let component: VerificarEmailComponent;
  let fixture: ComponentFixture<VerificarEmailComponent>;
  let verificacionServiceMock: any;

  beforeEach(async () => {
    verificacionServiceMock = {
      confirmarEmail: jasmine.createSpy('confirmarEmail')
    };

    await TestBed.configureTestingModule({
      declarations: [VerificarEmailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => 'FAKE_TOKEN'
              }
            }
          }
        },
        {
          provide: VerificacionCorreoService,
          useValue: verificacionServiceMock
        }
      ],
      schemas:  [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificarEmailComponent);
    component = fixture.componentInstance;
  });

  it('debería extraer el token del parámetro de la ruta', () => {
    verificacionServiceMock.confirmarEmail.and.returnValue(of({ activo: true }));
    fixture.detectChanges();
    expect(component.token).toBe('FAKE_TOKEN');
    expect(verificacionServiceMock.confirmarEmail).toHaveBeenCalledWith('FAKE_TOKEN');
  });

  it('debería activar usuarioActivo si la respuesta es positiva', () => {
    verificacionServiceMock.confirmarEmail.and.returnValue(of({ activo: true }));
    fixture.detectChanges();

    expect(component.usuarioActivo).toBeTrue();

    const mensaje = fixture.debugElement.query(By.css('div')).nativeElement.textContent;
    expect(mensaje).toContain('El usuario se encuentra activo');
  });

  it('debería mantener usuarioActivo en false si la respuesta es negativa', () => {
    verificacionServiceMock.confirmarEmail.and.returnValue(of({ activo: false }));
    fixture.detectChanges();

    expect(component.usuarioActivo).toBeFalse();

    const mensaje = fixture.debugElement.query(By.css('div')).nativeElement.textContent;
    expect(mensaje).toContain('El usuario no se encuentra activo');
  });

  it('debería manejar error si el servicio falla', () => {
    spyOn(console, 'error');
    verificacionServiceMock.confirmarEmail.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();

    expect(console.error).toHaveBeenCalled();
    expect(component.usuarioActivo).toBeFalse();
  });
});
*/