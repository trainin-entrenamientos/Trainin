import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemporizadorComponent } from './temporizador.component';
import { TemporizadorService } from '../../../core/servicios/temporizadorServicio/temporizador.service';
import { SimpleChange } from '@angular/core';

describe('TemporizadorComponent', () => {
  let component: TemporizadorComponent;
  let fixture: ComponentFixture<TemporizadorComponent>;
  let timerSpy: jasmine.SpyObj<TemporizadorService>;

  beforeEach(async () => {
    timerSpy = jasmine.createSpyObj('TemporizadorService', [
      'pausar',
      'continuar',
      'obtenerSegundosTranscurridos',
      'estaCorriendoTiempo',
    ]);

    await TestBed.configureTestingModule({
      declarations: [TemporizadorComponent],
      providers: [{ provide: TemporizadorService, useValue: timerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TemporizadorComponent);
    component = fixture.componentInstance;
  });

  it('Debería detener el contador cuando el temporizador cambia a pausado', () => {
    component.estaPausado = true;
    component.ngOnChanges({
      estaPausado: new SimpleChange(false, true, false),
    });
    expect(timerSpy.pausar).toHaveBeenCalled();
  });

  it('Debería reanudar el contador cuando se quita la pausa', () => {
    component.estaPausado = false;
    component.ngOnChanges({
      estaPausado: new SimpleChange(true, false, false),
    });
    expect(timerSpy.continuar).toHaveBeenCalled();
  });

  it('Debería mostrar el tiempo formateado con ceros al inicio del temporizador', () => {
    timerSpy.obtenerSegundosTranscurridos.and.returnValue(65);
    const text = component.tiempoTranscurrido;
    expect(text).toBe('01:05');
  });

  it('Debería indicar si el temporizador está corriendo según el servicio', () => {
    timerSpy.estaCorriendoTiempo.and.returnValue(true);
    expect(component.isRunning).toBeTrue();
    timerSpy.estaCorriendoTiempo.and.returnValue(false);
    expect(component.isRunning).toBeFalse();
  });
});
