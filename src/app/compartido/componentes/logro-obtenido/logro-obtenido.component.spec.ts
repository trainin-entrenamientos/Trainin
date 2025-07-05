import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, Subscription } from 'rxjs';
import { LogroService } from '../../../core/servicios/logroServicio/logro.service';
import { LogroObtenidoComponent } from './logro-obtenido.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LogroObtenidoComponent', () => {
  let component: LogroObtenidoComponent;
  let fixture: ComponentFixture<LogroObtenidoComponent>;
  let logroSubject: Subject<{ nombre: string; imagen: string }>;
  let mockService: Partial<LogroService>;

  beforeEach(() => {
    logroSubject = new Subject();
    mockService = {
      logroNotificaciones$: logroSubject.asObservable(),
    };

    TestBed.configureTestingModule({
      declarations: [LogroObtenidoComponent],
      providers: [{ provide: LogroService, useValue: mockService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LogroObtenidoComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    component['subLogros'] = new Subscription();
  });

  afterEach(() => {
    if ((component as any).subLogros) {
      (component as any).subLogros.unsubscribe();
    }
    fixture.destroy();
  });

  it('Debería determinar el nivel correcto del logro según su imagen', () => {
    expect(component.obtenerNivelDesdeImagen('foo-medalla-bronce.jpg')).toBe(
      'bronce'
    );
    expect(component.obtenerNivelDesdeImagen('img-medalla-plata.png')).toBe(
      'plata'
    );
    expect(component.obtenerNivelDesdeImagen('icon-medalla-oro.svg')).toBe(
      'oro'
    );
    expect(component.obtenerNivelDesdeImagen('medalla-platino.gif')).toBe(
      'platino'
    );
    expect(component.obtenerNivelDesdeImagen('otra-cosa.png')).toBe('default');
  });

  

  it('Debería iniciar notificaciones y desaparecerlas al destruir el componente', () => {
    component.ngOnInit();
    const sub: Subscription = (component as any).subLogros;
    spyOn(component, 'mostrarLogro');

    logroSubject.next({ nombre: 'N', imagen: 'img' });
    expect(component.mostrarLogro).toHaveBeenCalledWith('N', 'img');

    spyOn(sub, 'unsubscribe');
    component.ngOnDestroy();
    expect(sub.unsubscribe).toHaveBeenCalled();
  });
});
