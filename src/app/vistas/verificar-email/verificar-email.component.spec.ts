import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificarEmailComponent } from './verificar-email.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { VerificacionCorreoService } from '../../core/servicios/verificacionCorreoServicio/verificacion-correo.service';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RespuestaApi } from '../../core/modelos/RespuestaApiDTO';

describe('VerificarEmailComponent', () => {
  let component: VerificarEmailComponent;
  let fixture: ComponentFixture<VerificarEmailComponent>;
  let svc: jasmine.SpyObj<VerificacionCorreoService>;
  let toastrMock: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    svc = jasmine.createSpyObj('VerificacionCorreoService', ['confirmarEmail']);
    toastrMock = jasmine.createSpyObj('ToastrService', ['error']);

    await TestBed.configureTestingModule({
      declarations: [VerificarEmailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (_: string) => 'FAKE_TOKEN' } }
          }
        },
        { provide: VerificacionCorreoService, useValue: svc },
        { provide: ToastrService, useValue: toastrMock }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificarEmailComponent);
    component = fixture.componentInstance;
  });

  it('extrae token y llama al servicio con exito=true', () => {
    svc.confirmarEmail.and.returnValue(of({
      exito: true,
      mensaje: 'Confirmación exitosa',
      objeto: true
    } as RespuestaApi<boolean>));
    fixture.detectChanges();

    expect(component.token).toBe('FAKE_TOKEN');
    expect(svc.confirmarEmail).toHaveBeenCalledWith('FAKE_TOKEN');
    expect(component.usuarioActivo).toBeTrue();
  });

  it('muestra mensaje “activo” en el template cuando exito=true', () => {
    svc.confirmarEmail.and.returnValue(of({
      exito: true,
      mensaje: 'Confirmación exitosa',
      objeto: true
    } as RespuestaApi<boolean>));
    fixture.detectChanges();

    const texto = fixture.debugElement.query(By.css('div')).nativeElement.textContent;
    expect(texto).toContain('El usuario se encuentra activo');
  });

  it('mantiene usuarioActivo=false y muestra “no activo” cuando exito=false', () => {
    svc.confirmarEmail.and.returnValue(of({
      exito: false,
      mensaje: 'Confirmación exitosa',
      objeto: true
    } as RespuestaApi<boolean>));
    fixture.detectChanges();

    expect(component.usuarioActivo).toBeFalse();
    const texto = fixture.debugElement.query(By.css('div')).nativeElement.textContent;
    expect(texto).toContain('El usuario no se encuentra activo');
  });

  it('llama a manejarErrorSimple (toastr.error) si el servicio falla', () => {
    svc.confirmarEmail.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();

    expect(toastrMock.error).toHaveBeenCalledWith('No se pudo obtener el mail del usuario');
    expect(component.usuarioActivo).toBeFalse();
  });
});