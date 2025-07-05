import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { manejarErrorSimple, manejarErrorYRedirigir } from './errores-toastr';

describe('Funciones de manejo de errores', () => {
  let toastrMock: jasmine.SpyObj<ToastrService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    toastrMock = jasmine.createSpyObj('ToastrService', ['error']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
  });

  describe('manejarErrorSimple', () => {
    it('debería llamar a toastr.error con el mensaje proporcionado', () => {
      const mensaje = 'Error personalizado';
      manejarErrorSimple(toastrMock, mensaje);
      expect(toastrMock.error).toHaveBeenCalledWith(mensaje);
    });

    it('debería llamar a toastr.error con el mensaje por defecto cuando no se proporciona mensaje', () => {
      manejarErrorSimple(toastrMock);
      expect(toastrMock.error).toHaveBeenCalledWith('Ocurrió un error inesperado.');
    });
  });

  describe('manejarErrorYRedirigir', () => {
    it('debería llamar a toastr.error con el mensaje proporcionado y navegar a la URL proporcionada', () => {
      const mensaje = 'Error con redirección';
      const url = '/home';
      manejarErrorYRedirigir(toastrMock, routerMock, mensaje, url);
      expect(toastrMock.error).toHaveBeenCalledWith(mensaje);
      expect(routerMock.navigate).toHaveBeenCalledWith([url]);
    });

    it('debería llamar a toastr.error con el mensaje por defecto y navegar a la URL por defecto', () => {
      manejarErrorYRedirigir(toastrMock, routerMock);
      expect(toastrMock.error).toHaveBeenCalledWith('Ocurrió un error inesperado.');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
