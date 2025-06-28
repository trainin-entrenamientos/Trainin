/*import { InicioComponent } from './inicio.component';
import { ChangeDetectorRef, QueryList, ElementRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let cdRef: { detectChanges: jasmine.Spy };
  const originalBootstrap = (window as any).bootstrap;
  const originalIO = (window as any).IntersectionObserver;
  let observerCallbacks: Array<{ callback: Function; options: any }>;
  let carouselSpy: jasmine.Spy;
  let IOSpy: jasmine.Spy;

  beforeEach(() => {
    observerCallbacks = [];

    carouselSpy = jasmine.createSpy('CarouselSpy');
    const CarouselStub = function (this: any, el: any, opts: any) {
      carouselSpy(el, opts);
      this.element = el;
      this.options = opts;
    };
    (window as any).bootstrap = { Carousel: CarouselStub };

    const IOStub = function (this: any, callback: Function, options: any) {
      observerCallbacks.push({ callback, options });
      this.observe = jasmine.createSpy('observe');
      this.unobserve = jasmine.createSpy('unobserve');
      this.disconnect = jasmine.createSpy('disconnect');
    };
    IOSpy = jasmine.createSpy('IntersectionObserver').and.callFake(IOStub as any);
    (window as any).IntersectionObserver = IOSpy;

    cdRef = { detectChanges: jasmine.createSpy('detectChanges') };

    component = new InicioComponent(cdRef as any);
    component.heroCarousel        = { nativeElement: document.createElement('div') } as ElementRef;
    component.heroSection         = { nativeElement: document.createElement('section') } as ElementRef;
    component.whyItem1            = { nativeElement: document.createElement('div') } as ElementRef;
    component.whyItem2            = { nativeElement: document.createElement('div') } as ElementRef;
    component.whyItem3            = { nativeElement: document.createElement('div') } as ElementRef;
    component.correctionSection   = { nativeElement: document.createElement('div') } as ElementRef;
    component.subscriptionSection = { nativeElement: document.createElement('div') } as ElementRef;

    const galleryRowEl = document.createElement('div');
    ['col-md-4', 'col-md-4', 'col-md-4'].forEach(cls => {
      const d = document.createElement('div');
      d.className = cls;
      galleryRowEl.appendChild(d);
    });
    const galleryParent = document.createElement('div');
    galleryParent.appendChild(galleryRowEl);
    component.galleryRow = { nativeElement: galleryRowEl } as ElementRef;

    const emptyBenefits = new QueryList<ElementRef>();
    emptyBenefits.reset([]);
    component.benefitItems = emptyBenefits;

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      get: () => 800
    });
  });

  afterEach(() => {
    (window as any).bootstrap = originalBootstrap;
    (window as any).IntersectionObserver = originalIO;
  });

  it('debería inicializar bootstrap.Carousel y crear todos los IntersectionObservers', () => {
    component.ngAfterViewInit();

    expect(carouselSpy).toHaveBeenCalledWith(
      component.heroCarousel.nativeElement,
      jasmine.objectContaining({ interval: 3000 })
    );
    expect(carouselSpy).toHaveBeenCalledTimes(2);

    expect(IOSpy).toHaveBeenCalledTimes(6);

    expect(observerCallbacks[0].options).toEqual({ threshold: 1.0 });
    expect(observerCallbacks[1].options).toEqual({ threshold: 0.3 });
    expect(observerCallbacks[2].options).toEqual({ threshold: 0.3 });
    expect(observerCallbacks[3].options).toEqual({ threshold: 0.3 });
    expect(observerCallbacks[4].options).toEqual({ threshold: [0, 0.15, 0.25] });
    expect(observerCallbacks[5].options).toEqual({ threshold: 0.3 });
  });

  it('debería convertir galleryRow en carousel cuando la pantalla es pequeña', () => {
    const contenedor = component.galleryRow.nativeElement.parentNode as HTMLElement;
    expect((component as any).correctionInitialized).toBeFalse();

    component.ngAfterViewInit();
    expect((component as any).correctionInitialized).toBeTrue();

    const reemplazo = contenedor.firstChild as HTMLElement;
    expect(reemplazo).not.toBeNull();
    expect(reemplazo.className).toContain('carousel slide carousel-fade');
    expect(carouselSpy).toHaveBeenCalledWith(
      reemplazo,
      jasmine.objectContaining({ interval: 3000 })
    );
  });

  it('debería recargar la página al cambiar a pantalla grande tras inicializar', fakeAsync(() => {
    component.ngAfterViewInit();
    expect((component as any).correctionInitialized).toBeTrue();

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      get: () => 1200
    });

    const timeoutSpy = spyOn(window, 'setTimeout').and.callFake((handler: TimerHandler, timeout?: number, ...args: any[]) => {
      expect(timeout).toBe(300);
      return 0;
    });

    component.onResize();
    tick(300);

    expect(timeoutSpy).toHaveBeenCalled();
  }));

  it('debería actualizar los estados internos cuando los observers disparen callbacks', () => {
    const elA = document.createElement('div');
    const elB = document.createElement('div');
    const q = new QueryList<ElementRef>();
    q.reset([{ nativeElement: elA } as ElementRef, { nativeElement: elB } as ElementRef]);
    component.benefitItems   = q;
    component.benefitVisible = [];

    component.ngAfterViewInit();

    observerCallbacks[1].callback([{ isIntersecting: true }]);
    expect(component.slideWhyItems[0]).toBe('visible');

    observerCallbacks[0].callback([{ isIntersecting: true }]);
    expect(component.sectionVisible).toBeTrue();

    observerCallbacks[4].callback([{ intersectionRatio: 0.3 }]);
    expect(component.correctionVisible).toBeTrue();
    observerCallbacks[4].callback([{ intersectionRatio: 0.1 }]);
    expect(component.correctionVisible).toBeFalse();

    observerCallbacks[5].callback([{ isIntersecting: true }]);
    expect(component.subscriptionVisible).toBeTrue();

    observerCallbacks[6].callback([{ isIntersecting: true }]);
    expect(component.benefitVisible[0]).toBeTrue();
    expect(cdRef.detectChanges).toHaveBeenCalled();
  });
});*/