import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderComponent]
    });
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener como valor por defecto "Cargando…"', () => {
    expect(component.message).toBe('Cargando…');
  });

  it('debería permitir cambiar el mensaje', () => {
    component.message = 'Cargando datos adicionales...';
    expect(component.message).toBe('Cargando datos adicionales...');
  });
});
