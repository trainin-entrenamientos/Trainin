import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { CalibracionCamaraComponent } from './calibracion-camara.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NombreEjercicio } from '../../compartido/enums/nombre-ejercicio.enum';

describe('CalibracionCamaraComponent', () => {
  let component: CalibracionCamaraComponent;
  let fixture: ComponentFixture<CalibracionCamaraComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [CalibracionCamaraComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => NombreEjercicio.SENTADILLA } },
          },
        },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalibracionCamaraComponent);
    component = fixture.componentInstance;

    const video = document.createElement('video') as HTMLVideoElement;
    Object.defineProperty(video, 'videoWidth', {
      value: 320,
      configurable: true,
    });
    Object.defineProperty(video, 'videoHeight', {
      value: 240,
      configurable: true,
    });
    Object.defineProperty(video, 'clientWidth', {
      value: 640,
      configurable: true,
    });
    Object.defineProperty(video, 'clientHeight', {
      value: 480,
      configurable: true,
    });
    (video.play as any) = jasmine.createSpy('play').and.callFake(() => {
      video.onloadedmetadata?.(new Event('loadedmetadata'));
      return Promise.resolve();
    });

    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const ctxSpy = jasmine.createSpyObj<CanvasRenderingContext2D>('ctx', [
      'clearRect',
      'beginPath',
      'arc',
      'fill',
    ]);
    spyOn(canvas, 'getContext').and.returnValue(ctxSpy as any);

    component.videoRef = new ElementRef(video);
    component.canvasRef = new ElementRef(canvas);
    (component as any).ctx = ctxSpy;
  });

  it('debería crearse y leer la clave de ejercicio', () => {
    expect(component).toBeTruthy();
    expect(component.clave).toBe(NombreEjercicio.SENTADILLA);
  });

  describe('ngAfterViewInit', () => {
    it('debería llamar a createDetector y startCam', fakeAsync(() => {
      spyOn(component, 'createDetector').and.returnValue(Promise.resolve());
      spyOn(component, 'startCam').and.returnValue(Promise.resolve());

      component.ngAfterViewInit();
      tick();

      expect(component.createDetector).toHaveBeenCalled();
      expect(component.startCam).toHaveBeenCalled();
    }));
  });

  describe('startCam', () => {
    it('debería alertar si no hay getUserMedia', fakeAsync(() => {
      spyOnProperty(navigator, 'mediaDevices', 'get').and.returnValue(
        undefined as any
      );
      spyOn(window, 'alert');

      component.startCam();
      tick();

      expect(window.alert).toHaveBeenCalledWith(
        'Tu navegador no soporta cámara.'
      );
    }));

    it('debería alertar si hay error no-AbortError', fakeAsync(() => {
      const mediaDevicesMock = {
        getUserMedia: jasmine
          .createSpy('getUserMedia')
          .and.returnValue(Promise.reject({ name: 'OtherError' })),
      } as unknown as MediaDevices;

      spyOnProperty(navigator, 'mediaDevices', 'get').and.returnValue(
        mediaDevicesMock
      );
      spyOn(window, 'alert');

      component.startCam();
      tick();

      expect(window.alert).toHaveBeenCalledWith(
        'No se pudo acceder a la cámara. Verifica permisos, cierra otras aplicaciones que puedan usarla o reinicia el navegador.'
      );
    }));
  });

  it('adjustCanvasSize ajusta dimensiones y estilos', () => {
    component.adjustCanvasSize();
    const v = component.videoRef.nativeElement;
    const c = component.canvasRef.nativeElement;
    expect(c.width).toBe(320);
    expect(c.height).toBe(240);
    expect(c.style.width).toBe('640px');
    expect(c.style.height).toBe('480px');
  });

  it('drawPose no dibuja si no hay poses', () => {
    const ctx = (component as any)
      .ctx as jasmine.SpyObj<CanvasRenderingContext2D>;
    component.drawPose([]);
    expect(ctx.clearRect).toHaveBeenCalled();
    expect(ctx.beginPath).not.toHaveBeenCalled();
  });

  it('drawPose dibuja cada keypoint correctamente', () => {
    const ctx = (component as any)
      .ctx as jasmine.SpyObj<CanvasRenderingContext2D>;
    const pose = {
      keypoints: [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ],
    } as any;
    component.drawPose([pose]);
    expect(ctx.beginPath).toHaveBeenCalledTimes(2);
    expect(ctx.arc).toHaveBeenCalledWith(1, 2, 6, 0, 2 * Math.PI);
    expect(ctx.arc).toHaveBeenCalledWith(3, 4, 6, 0, 2 * Math.PI);
    expect((ctx as any).fillStyle).toBe('limegreen');
  });

  it('handleResize dispara adjustCanvasSize', () => {
    spyOn(component, 'adjustCanvasSize');
    (component as any).handleResize();
    expect(component.adjustCanvasSize).toHaveBeenCalled();
  });

  it('cerrar debe detener cámara', () => {
    spyOn(component, 'detenerCamara');
    component.cerrar();
    expect(component.detenerCamara).toHaveBeenCalled();
  });

  it('volverARutina detiene cámara y navega', () => {
    spyOn(component, 'detenerCamara');
    component.volverARutina();
    expect(component.detenerCamara).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/informacion-ejercicio',
    ]);
  });

  it('ngOnDestroy detiene cámara y remueve listener', () => {
    spyOn(component, 'detenerCamara');
    spyOn(window, 'removeEventListener');
    component.ngOnDestroy();
    expect(component.detenerCamara).toHaveBeenCalled();
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'resize',
      (component as any).handleResize
    );
  });

  describe('detectPoseLoop', () => {
    it('no hace nada si no está corriendo', () => {
      component.webcamRunning = false;
      component.detector = {} as any;
      component.detectPoseLoop();
      expect((component as any).animationFrameId).toBeNull();
    });

    it('estima pose, dibuja y agenda siguiente frame', fakeAsync(() => {
      component.webcamRunning = true;
      const dummy = { keypoints: [] } as any;
      const detSpy = jasmine.createSpyObj('det', ['estimatePoses']);
      detSpy.estimatePoses.and.returnValue(Promise.resolve([dummy]));
      component.detector = detSpy;
      spyOn(component, 'drawPose');
      spyOn(window, 'requestAnimationFrame').and.returnValue(999);

      component.detectPoseLoop();
      tick();

      expect(detSpy.estimatePoses).toHaveBeenCalledWith(
        component.videoRef.nativeElement
      );
      expect(component.drawPose).toHaveBeenCalledWith([dummy]);
      expect((component as any).animationFrameId).toBe(999);
    }));
  });
});