import { ComponentFixture, TestBed, fakeAsync, tick, flush, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { CorreccionPosturaComponent } from './correccion-postura.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FabricaManejadoresService } from '../../core/servicios/correccionPosturaServicio/fabrica-manejadores.service';
import { CorreccionDataService } from '../../core/servicios/correccionPosturaServicio/correccion-data.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NombreEjercicio } from '../../compartido/enums/nombre-ejercicio.enum';
import { formatearNombreEjercicio } from '../../compartido/utilidades/correccion-postura.utils';

describe('CorreccionPosturaComponent', () => {
  let component: CorreccionPosturaComponent;
  let fixture: ComponentFixture<CorreccionPosturaComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let fabricaSpy: jasmine.SpyObj<FabricaManejadoresService>;
  let dataSpy: jasmine.SpyObj<CorreccionDataService>;
  let modalSpy: jasmine.SpyObj<NgbModal>;
  let handlerSpy: jasmine.SpyObj<any>;
  let videoEl: HTMLVideoElement;
  let canvasEl: HTMLCanvasElement;
  let ctxSpy: jasmine.SpyObj<CanvasRenderingContext2D>;

  beforeEach(waitForAsync(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    fabricaSpy = jasmine.createSpyObj('FabricaManejadoresService', ['obtenerManejador']);
    dataSpy = jasmine.createSpyObj('CorreccionDataService', ['registrarResultado']);
    modalSpy = jasmine.createSpyObj('NgbModal', ['open']);
    handlerSpy = jasmine.createSpyObj('ManejadorCorreccion', ['reset', 'manejarTecnica'], {
      videoUrl: 'https://youtube.com/embed/123'
    });
    fabricaSpy.obtenerManejador.and.returnValue(handlerSpy);

    TestBed.configureTestingModule({
      declarations: [CorreccionPosturaComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: FabricaManejadoresService, useValue: fabricaSpy },
        { provide: CorreccionDataService, useValue: dataSpy },
        { provide: NgbModal, useValue: modalSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => NombreEjercicio.SENTADILLA } } }
        },
        {
          provide: DomSanitizer,
          useValue: { bypassSecurityTrustResourceUrl: (url: string) => url }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorreccionPosturaComponent);
    component = fixture.componentInstance;

    component.ejercicio = NombreEjercicio.SENTADILLA;
    component.manejador  = handlerSpy;

    videoEl = document.createElement('video');
    Object.defineProperty(videoEl, 'videoWidth',  { value: 320, configurable: true });
    Object.defineProperty(videoEl, 'videoHeight', { value: 240, configurable: true });
    Object.defineProperty(videoEl, 'clientWidth', { value: 640, configurable: true });
    Object.defineProperty(videoEl, 'clientHeight',{ value: 480, configurable: true });
    spyOn(videoEl, 'play').and.callFake(() => {
      videoEl.onloadedmetadata?.(new Event('loadedmetadata'));
      return Promise.resolve();
    });
    spyOnProperty(videoEl, 'srcObject', 'set').and.callFake(() => {});
    spyOnProperty(videoEl, 'srcObject', 'get').and.returnValue(null);

    canvasEl = document.createElement('canvas');
    ctxSpy   = jasmine.createSpyObj('ctx', ['clearRect','beginPath','arc','fill']);
    spyOn(canvasEl, 'getContext').and.returnValue(ctxSpy as any);

    component.videoRef  = new ElementRef(videoEl);
    component.canvasRef = new ElementRef(canvasEl);
  });

  describe('ngOnInit: videoUrl', () => {
    beforeEach(() => sessionStorage.clear());

    it('sin sessionStorage usa handler.videoUrl', () => {
      component.ngOnInit();
      expect(component.videoUrl as SafeResourceUrl).toBe(handlerSpy.videoUrl);
    });

    it('con sessionStorage válido y video watch?v= convierte ID', () => {
      const rutina = {
        ejercicios: [{
          nombre: formatearNombreEjercicio(NombreEjercicio.SENTADILLA),
          video: 'https://youtube.com/watch?v=ABC123&foo'
        }]
      };
      sessionStorage.setItem('rutina', JSON.stringify(rutina));
      component.ngOnInit();
      expect(
        (component.videoUrl as string).startsWith('https://www.youtube.com/embed/ABC123')
      ).toBeTrue();
    });

    it('con sessionStorage inválido atrapa error y usa handler.videoUrl', () => {
      sessionStorage.setItem('rutina', '{ mal json');
      spyOn(console, 'error');
      component.ngOnInit();
      expect(console.error).toHaveBeenCalled();
      expect(component.videoUrl as SafeResourceUrl).toBe(handlerSpy.videoUrl);
    });

    it('con sesión pero sin entrada/video usa handler.videoUrl', () => {
      sessionStorage.setItem('rutina', JSON.stringify({ ejercicios: [] }));
      component.ngOnInit();
      expect(component.videoUrl as SafeResourceUrl).toBe(handlerSpy.videoUrl);
    });
  });

  describe('ngAfterViewInit + crearDetector + iniciarCamara', () => {
    beforeEach(() => {
      spyOn(window, 'addEventListener');
      spyOn<any>(component, 'crearDetector').and.returnValue(Promise.resolve());
      spyOn<any>(component, 'iniciarCamara').and.returnValue(Promise.resolve());
    });

    it('llama a crearDetector, iniciarCamara y registra resize', fakeAsync(() => {
      component.ngAfterViewInit();
      tick();
      expect((component as any).crearDetector).toHaveBeenCalled();
      expect((component as any).iniciarCamara).toHaveBeenCalled();
      expect(window.addEventListener)
        .toHaveBeenCalledWith('resize', (component as any).onResize);
    }));
  });

  describe('iniciarCamara', () => {
    it('alerta si no hay getUserMedia', async () => {
      spyOnProperty(navigator, 'mediaDevices', 'get')
        .and.returnValue(undefined as any);
      spyOn(window, 'alert');
      await (component as any).iniciarCamara();
      expect(window.alert).toHaveBeenCalledWith('Tu navegador no soporta cámara.');
    });

    it('inicia cámara y establece camaraActiva', async () => {
      const fakeStream = { getTracks: () => [] } as any;
      const md = { getUserMedia: jasmine.createSpy().and.returnValue(Promise.resolve(fakeStream)) } as any;
      spyOnProperty(navigator, 'mediaDevices', 'get').and.returnValue(md);
      await (component as any).iniciarCamara();
      expect(md.getUserMedia).toHaveBeenCalledWith({ video: true });
      expect(component.camaraActiva).toBeTrue();
      expect(component.cargandoCamara).toBeFalse();
    });

    it('reintenta AbortError y finalmente alerta tras 5 intentos', fakeAsync(() => {
      const err = { name: 'AbortError' };
      const md = { getUserMedia: jasmine.createSpy().and.returnValue(Promise.reject(err)) } as any;
      spyOnProperty(navigator, 'mediaDevices', 'get').and.returnValue(md);
      spyOn(console, 'warn');
      spyOn(window, 'alert');

      (component as any).iniciarCamara();
      for (let i = 0; i < 6; i++) tick(1000);

      expect(console.warn).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(
        'No se pudo acceder a la cámara. Revisa permisos.'
      );
      flush();
    }));
  });

  it('detenerCamara detiene stream y asigna camaraActiva=false', () => {
    (videoEl as any).srcObject = { getTracks: () => [ { stop: ()=>{} } ] };
    component.camaraActiva = true;
    (component as any).idFrameAnimacion = 123;
    spyOn(window, 'cancelAnimationFrame');
    component.ngOnDestroy();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(123);
    expect(component.camaraActiva).toBeFalse();
  });

  describe('iniciar countdown y comenzarCorreccion', () => {
    it('cuenta 5..0 y llama comenzarCorreccion', fakeAsync(() => {
      spyOn(component, 'comenzarCorreccion');
      component.iniciar();
      expect(component.contador).toBe(5);
      tick(5000);
      expect(component.mostrarBotonIniciar).toBeFalse();
      expect(component.comenzarCorreccion).toHaveBeenCalled();
      flush();
    }));

    it('comenzarCorreccion resetea UI y llama handler.reset', () => {
      component.comenzarCorreccion();
      expect(handlerSpy.reset).toHaveBeenCalled();
      expect(component.corrigiendo).toBeTrue();
      expect(component.mostrarBotonReintentar).toBeFalse();
      expect(component.repeticionesActuales).toBe(0);
      expect(component.resultados).toEqual([]);
    });
  });

  describe('bucleDeteccion + dibujarLandmarks + procesarResultado', () => {
    it('no hace nada si camaraActiva=false', fakeAsync(() => {
      component.camaraActiva = false;
      (component as any).detector = { estimatePoses: jasmine.createSpy() };
      (component as any).bucleDeteccion();
      tick();
      expect((component as any).detector.estimatePoses).not.toHaveBeenCalled();
    }));

    it('dibuja y procesa resultado con repContada y termino', fakeAsync(() => {
      component.camaraActiva = true;
      component.corrigiendo   = true;
      const fakePose = { keypoints: [] } as any;
      (component as any).detector = {
        estimatePoses: jasmine.createSpy().and.returnValue(Promise.resolve([fakePose]))
      };
      spyOn<any>(component, 'dibujarLandmarks');
      handlerSpy.manejarTecnica.and.returnValue({
        mensaje: 'ok',
        color: 'green',
        repContada: true,
        totalReps: 1,
        termino: true,
        resumenHtml: '<p>r</p>'
      });
      spyOn<any>(component, 'procesarResultado');

      (component as any).bucleDeteccion();
      tick();
      expect((component as any).detector.estimatePoses).toHaveBeenCalled();
      expect((component as any).dibujarLandmarks).toHaveBeenCalled();
      expect(component.manejador.manejarTecnica).toHaveBeenCalledWith(fakePose.keypoints);
      expect((component as any).procesarResultado).toHaveBeenCalled();
      flush();
    }));
  });

  it('dibujarLandmarks calcula escalas y dibuja círculos', () => {
    component.colorRetroalimentacion = 'red';
    component.dibujarLandmarks([{ x: 1, y: 2 }] as any);
    expect(ctxSpy.clearRect).toHaveBeenCalled();
    expect(ctxSpy.beginPath).toHaveBeenCalled();
    expect(ctxSpy.arc).toHaveBeenCalled();
    expect(ctxSpy.fillStyle).toBe('red');
  });

  describe('procesarResultado', () => {
    beforeEach(() => {
      spyOn<any>(component, 'hablar');
      spyOn<any>(component, 'dispararBeep');
      spyOn<any>(component, 'updateCirculos');
    });

    it('solo mensaje llama hablar y deja HTML', () => {
      component.procesarResultado({
        mensaje: '<b>Hola</b>',
        color: 'green',
        repContada: false,
        totalReps: 0,
        termino: false
      });
      expect(component.retroalimentacion).toBe('<b>Hola</b>');
      expect(component.colorRetroalimentacion).toBe('green');
      expect((component as any).hablar).toHaveBeenCalled();
    });

    it('repContada beeps y circulos', () => {
      component.procesarResultado({
        mensaje: null,
        color: 'red',
        repContada: true,
        totalReps: 2,
        termino: false
      });
      expect(component.repeticionesActuales).toBe(2);
      expect(component.resultados).toEqual([false]);
      expect((component as any).dispararBeep).toHaveBeenCalledWith(220);
      expect((component as any).updateCirculos).toHaveBeenCalled();
    });

    it('termino registra en dataService y llama hablar resumen', () => {
      component.resultados = [true, true];
      const speakSpy = (component as any).hablar as jasmine.Spy;

      component.procesarResultado({
        mensaje: null,
        color: '',
        repContada: false,
        totalReps: 5,
        termino: true,
        resumenHtml: '<p>res</p>'
      });

      expect(component.ultimoPorcentaje).toBe(Math.round(2 / 5 * 100));
      expect(dataSpy.registrarResultado)
        .toHaveBeenCalledWith(
          NombreEjercicio.SENTADILLA,
          component.ultimoPorcentaje,
          0
        );
      expect(speakSpy).toHaveBeenCalledWith('res');
    });
  });

  it('dispararBeep crea oscillator y ejecuta start/stop', () => {
    const oscSpy = jasmine.createSpyObj('OscillatorNode', ['start','stop'], {
      frequency: { value: 0 }, connect: jasmine.createSpy()
    });
    spyOn((window as any).AudioContext.prototype, 'createOscillator')
      .and.returnValue(oscSpy);
    (component as any).contextoAudio = new AudioContext();
    (component as any).dispararBeep(440);
    expect(oscSpy.frequency.value).toBe(440);
    expect(oscSpy.start).toHaveBeenCalled();
    expect(oscSpy.stop).toHaveBeenCalled();
  });

  it('hablar configura utterance y llama speechSynthesis.speak sin error', () => {
    spyOn(speechSynthesis, 'getVoices').and.returnValue([{
      name: 'Otro Voice', lang: 'en-US',
      voiceURI: '', localService: false, default: false
    }] as any);
    const speakSpy = spyOn(speechSynthesis, 'speak');
    (component as any).hablar('texto');
    expect(speakSpy).toHaveBeenCalled();
  });

  it('reintentar incrementa reintentos y reinicia UI', () => {
    spyOn(component, 'iniciar');
    component.reintentos = 1;
    component.reintentar();
    expect(component.reintentos).toBe(2);
    expect(component.mostrarBotonReintentar).toBeFalse();
    expect(component.retroalimentacion).toBe('');
    expect(component.resumenHtml).toBe('');
    expect(component.iniciar).toHaveBeenCalled();
  });

  describe('finalizarPractica', () => {
    it('no hace nada si <60% y reintentos < max', () => {
      component.ultimoPorcentaje = 50;
      component.reintentos      = 1;
      component.finalizarPractica();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('abre modal si <60% y reintentos >= max y maneja continuar', fakeAsync(() => {
      component.ultimoPorcentaje = 50;
      component.reintentos      = component.maxReintentos;
      const modalRef = { result: Promise.resolve('continuar') } as NgbModalRef;
      modalSpy.open.and.returnValue(modalRef);
      spyOn<any>(component, 'detenerCamara');

      component.finalizarPractica();
      tick();
      expect(modalSpy.open).toHaveBeenCalled();

      modalRef.result.then(() => {
        expect((component as any).detenerCamara).toHaveBeenCalled();
        expect(routerSpy.navigate)
          .toHaveBeenCalledWith(['/realizar-ejercicio']);
      });
    }));

    it('navega si >=60%', () => {
      spyOn<any>(component, 'detenerCamara');
      component.ultimoPorcentaje = 80;
      component.finalizarPractica();
      expect((component as any).detenerCamara).toHaveBeenCalled();
      expect(routerSpy.navigate)
        .toHaveBeenCalledWith(['/realizar-ejercicio']);
    });
  });

  it('volver detiene cámara y navega', () => {
    spyOn<any>(component, 'detenerCamara');
    component.volver();
    expect((component as any).detenerCamara).toHaveBeenCalled();
    expect(routerSpy.navigate)
      .toHaveBeenCalledWith(['/informacion-ejercicio']);
  });

  it('updateCirculos marca correctamente los divs', () => {
    document.body.innerHTML = '';

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="repeticiones-pc">
        <div class="contenedor-circulos">
          <div class="circulo"></div>
          <div class="circulo"></div>
        </div>
      </div>
      <div class="repeticiones-mobile">
        <div class="contenedor-circulos">
          <div class="circulo"></div>
          <div class="circulo"></div>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    component.resultados = [true];

    component.updateCirculos();

    const pcCirculos = container.querySelectorAll('.repeticiones-pc .circulo');
    expect(pcCirculos[0].classList).toContain('activo');
    expect(pcCirculos[0].classList).toContain('correcto');
    expect(pcCirculos[1].classList).not.toContain('activo');

    const mbCirculos = container.querySelectorAll('.repeticiones-mobile .circulo');
    expect(mbCirculos[0].classList).toContain('activo');
    expect(mbCirculos[0].classList).toContain('correcto');
    expect(mbCirculos[1].classList).not.toContain('activo');

    document.body.removeChild(container);
  });

});