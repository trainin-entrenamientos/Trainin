/*import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crear el componente loader sin errores', () => {
    expect(component).toBeTruthy();
  });

  it('Debería mostrar el mensaje por defecto', () => {
    const text = fixture.nativeElement.textContent || '';
    expect(text).toContain('Cargando…');
  });

  it('Debería mostrar el mensaje personalizado cuando se cambian los datos ingresados', () => {
    component.message = 'Esperando datos';
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent || '';
    expect(text).toContain('Esperando datos');
  });
});*/