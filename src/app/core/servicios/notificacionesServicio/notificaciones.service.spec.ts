/* import { TestBed } from '@angular/core/testing';
import { NotificacionesService } from './notificaciones.service';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

describe('NotificacionesService', () => {
  let service: NotificacionesService;
  let afMessagingSpy: jasmine.SpyObj<AngularFireMessaging>;
  let httpMock: HttpTestingController;

  let messagesSubject: BehaviorSubject<any>;
  let requestTokenSubject: BehaviorSubject<string | null>;

  beforeEach(() => {
    messagesSubject = new BehaviorSubject<any>(null);
    requestTokenSubject = new BehaviorSubject<string | null>(null);

    afMessagingSpy = jasmine.createSpyObj('AngularFireMessaging', [], {
      messages: messagesSubject.asObservable(),
      requestToken: requestTokenSubject.asObservable()
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AngularFireMessaging, useValue: afMessagingSpy }]
    });

    service = TestBed.inject(NotificacionesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('debería suscribirse a mensajes y actualizar message$', (done) => {
      const testMsg = { notification: 'Hola' };
      service.message$.subscribe((msg) => {
        if (msg) {
          expect(msg).toEqual(testMsg);
          done();
        }
      });
      messagesSubject.next(testMsg);
    });
  });

  describe('pedirPermisoYRegistrar', () => {
    let originalRequestPermission: any;

    beforeEach(() => {
      originalRequestPermission = Notification.requestPermission;
    });

    afterEach(() => {
      Notification.requestPermission = originalRequestPermission;
    });

    it('no hace nada si el permiso no es concedido', (done) => {
      Notification.requestPermission = () => Promise.resolve('denied');
      spyOn(console, 'warn');

      service.pedirPermisoYRegistrar();

      setTimeout(() => {
        expect(console.warn).toHaveBeenCalledWith('Notificaciones DENEGADAS');
        done();
      }, 0);
    });

    it('llama a enviarTokenAlBackend si el permiso es concedido y hay token', (done) => {
        Notification.requestPermission = () => Promise.resolve('granted');
        const testToken = 'abc123';

        spyOn<any>(service, 'enviarTokenAlBackend').and.callThrough();

        service.pedirPermisoYRegistrar();

        requestTokenSubject.next(testToken);

        setTimeout(() => {
            expect(service['enviarTokenAlBackend']).toHaveBeenCalledWith(testToken);

            const req = httpMock.expectOne(`${environment.URL_BASE}/notificacion/registrarToken`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({ token: testToken });
            req.flush({});

            done();
        }, 0);
        });


    it('maneja error al obtener el token', (done) => {
      Notification.requestPermission = () => Promise.resolve('granted');
      spyOn(console, 'error');

      service.pedirPermisoYRegistrar();

      requestTokenSubject.error('Test error');

      setTimeout(() => {
        expect(console.error).toHaveBeenCalledWith('Error token FCM', 'Test error');
        done();
      }, 0);
    });

    it('no llama a enviarTokenAlBackend si no hay token', (done) => {
      Notification.requestPermission = () => Promise.resolve('granted');

      const spy = spyOn<any>(service, 'enviarTokenAlBackend');

      service.pedirPermisoYRegistrar();

      requestTokenSubject.next(null);

      setTimeout(() => {
        expect(spy).not.toHaveBeenCalled();
        done();
      }, 0);
    });
  });

  describe('enviarTokenAlBackend', () => {
    it('envía el token al backend y maneja error si falla', () => {
      const token = 'abc123';
      spyOn(console, 'error');

      (service as any).enviarTokenAlBackend(token);

      const req = httpMock.expectOne(`${environment.URL_BASE}/notificacion/registrarToken`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token });

      req.error(new ErrorEvent('Test error'));

      expect(console.error).toHaveBeenCalled();
    });
  });
}); */