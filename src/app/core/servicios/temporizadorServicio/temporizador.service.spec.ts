import { TestBed } from '@angular/core/testing';
import { TemporizadorService } from './temporizador.service';

describe('TemporizadorService', () => {
  let service: TemporizadorService;

  beforeEach(() => {
    sessionStorage.clear();
    jasmine.clock().install();
    TestBed.configureTestingModule({
      providers: [TemporizadorService]
    });
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('Debería inicializar el temporizador en 0 y quedar detenido', () => {
    service = TestBed.inject(TemporizadorService);
    expect(service.obtenerSegundosTranscurridos()).toBe(0);
    expect(service.estaCorriendoTiempo()).toBeFalse();
  });

  it('Debería si ya hay tiempo corriendo debe restaurarlo y avanzar con el contador a partir del tiempo ya existente', () => {
    sessionStorage.setItem('tiempo_global', '120');
    sessionStorage.setItem('tiempo_en_ejecucion', 'true');

    service = TestBed.inject(TemporizadorService);
    expect(service.obtenerSegundosTranscurridos()).toBe(120);
    expect(service.estaCorriendoTiempo()).toBeTrue();
  });

  it('Debería iniciar el contador', () => {
    service = TestBed.inject(TemporizadorService);
    service.iniciarTiempo();
    expect(service.estaCorriendoTiempo()).toBeTrue();

    jasmine.clock().tick(1000);
    expect(sessionStorage.getItem('tiempo_en_ejecucion')).toBe('true');

    jasmine.clock().tick(1000);
    expect(service.obtenerSegundosTranscurridos()).toBe(2);
    expect(sessionStorage.getItem('tiempo_global')).toBe('2');
  });

  it('Debería pausar el contador al poner pausa', () => {
    service = TestBed.inject(TemporizadorService);
    service.iniciarTiempo();
    jasmine.clock().tick(1000);

    service.pausar();
    expect(service.estaCorriendoTiempo()).toBeFalse();
    expect(sessionStorage.getItem('tiempo_en_ejecucion')).toBe('false');

    const paused = service.obtenerSegundosTranscurridos();
    jasmine.clock().tick(2000);
    expect(service.obtenerSegundosTranscurridos()).toBe(paused);
  });

  it('Debería reiniciar el contador', () => {
    service = TestBed.inject(TemporizadorService);
    service.iniciarTiempo();
    jasmine.clock().tick(3000);

    service.reiniciarTiempo();
    expect(service.obtenerSegundosTranscurridos()).toBe(0);
    expect(service.estaCorriendoTiempo()).toBeFalse();
    expect(sessionStorage.getItem('tiempo_global')).toBe('0');
  });

  it('Debería pasar el tiempo a partir de la cantidad de segundos al formato minutos+segundos', () => {
    service = TestBed.inject(TemporizadorService);
    expect(service.formatearTiempo(0)).toBe('00:00');
    expect(service.formatearTiempo(5)).toBe('00:05');
    expect(service.formatearTiempo(65)).toBe('01:05');
    expect(service.formatearTiempo(600)).toBe('10:00');
  });

  it('Debería pausar o continuar el contador según si está o no activada la pausa', () => {
    service = TestBed.inject(TemporizadorService);

    service.accionesDePausa(true);
    expect(service.estaCorriendoTiempo()).toBeFalse();

    service.accionesDePausa(false);
    expect(service.estaCorriendoTiempo()).toBeTrue();
  });
});