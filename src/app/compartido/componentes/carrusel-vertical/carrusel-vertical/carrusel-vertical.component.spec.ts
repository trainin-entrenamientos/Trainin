import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { CarruselVerticalComponent } from './carrusel-vertical.component';

describe('CarruselVerticalComponent', () => {
  let component: CarruselVerticalComponent;
  let fixture: ComponentFixture<CarruselVerticalComponent>;
  const fakeElement = { scrollWidth: 120, scrollHeight: 240, style: { transform: '' } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarruselVerticalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CarruselVerticalComponent);
    component = fixture.componentInstance;
    component.contenido = new ElementRef<any>(fakeElement);
  });

  it('Debería añadir un elemento nuevo al carrusel', () => {
    const inicial = component.items.length;
    component.nuevoItem = { tipo: 'texto', contenido: 'Hola Mundo' };
    expect(component.items.length).toBe(inicial + 1);
    expect(component.items[inicial]).toEqual({ tipo: 'texto', contenido: 'Hola Mundo' });
  });

  it('Debería poner el carrusel en movimiento y duplicar los ítems al iniciar', () => {
    (window as any).innerWidth = 800;
    spyOn((component as any).detectorDeCambios, 'detectChanges');

    component.ngAfterViewInit();

    expect(component.items.length).toBe(3 * 3);
    expect(component.estaPausado).toBeFalse();
    expect(component.posicionDeScroll).toBeCloseTo(-fakeElement.scrollWidth / 3 + component.velocidad, 5);
    expect((component as any).detectorDeCambios.detectChanges).toHaveBeenCalled();
    expect(fakeElement.style.transform).toContain('translateX');
  });

  it('Debería adaptar el carrusel al ancho del navegador', () => {
    (window as any).innerWidth = 1200;
    component.esModoHorizontal = false;
    component.ajustarTamanio();
    expect(component.esModoHorizontal).toBeFalse();

    (window as any).innerWidth = 600;
    component.ajustarTamanio();
    expect(component.esModoHorizontal).toBeTrue();
  });

  it('Debería permitir arrastrar el carrusel con el mouse', () => {
    component.esModoHorizontal = false;

    component.cuandoBajoElMouse({ clientX: 0, clientY: 50 } as MouseEvent);
    expect(component.estaDeslizandose).toBeTrue();
    expect(component.ultimaPosicion).toBe(50);
    expect(component.seDeslizo).toBeFalse();

    component.cuandoMuevoElMouse({ clientX: 0, clientY: 60 } as MouseEvent);
    expect(component.aceleracion).toBe((60 - 50) * 0.2);
    expect(component.seDeslizo).toBeTrue();
    expect(component.ultimaPosicion).toBe(60);

    component.cuandoSuboElMouse();
    expect(component.estaDeslizandose).toBeFalse();
  });

  it('Debería marcar y desmarcar un ítem al hacer click', () => {
    component.seDeslizo = false;
    component.seleccionarItem(2);
    expect(component.indiceSeleccionado).toBe(0);
    expect(component.estaPausado).toBeTrue();

    component.seleccionarItem(5);
    expect(component.indiceSeleccionado).toBeNull();
    expect(component.estaPausado).toBeFalse();
  });

  it('No debería agregar un elemento cuando el item no está definido', () => {
    const count = component.items.length;
    component.nuevoItem = undefined;
    expect(component.items.length).toBe(count);
  });

  it('Debería usar el ancho de la ventana del navegador al realizar la animación', () => {
    (window as any).innerWidth = 1200;
    component.estaPausado = false;
    component.animacion();
    expect(fakeElement.style.transform).toContain('translateY');
  });

  it('Debería reiniciar la posición al inicio cuando se supera el tamaño del contenido', () => {
    (window as any).innerWidth = 1200;
    component.posicionDeScroll = 1;
    component.estaPausado = false;
    component.animacion();

    const start = -fakeElement.scrollHeight / 3;
    expect(component.posicionDeScroll).toBe(start);
  });

  it('Debería mantener la posición si la animación está pausada', () => {
    component.estaPausado = true;
    spyOn(window, 'requestAnimationFrame');
    component.animacion();
    expect(window.requestAnimationFrame).toHaveBeenCalled();
    expect(component.posicionDeScroll).toBe(0);
  });

  it('No debería cambiar la selección cuando el usuario arrastró el mouse antes de hacer click', () => {
    component.seDeslizo = true;
    component.indiceSeleccionado = null;
    component.seleccionarItem(0);
    expect(component.indiceSeleccionado).toBeNull();
  });

});
