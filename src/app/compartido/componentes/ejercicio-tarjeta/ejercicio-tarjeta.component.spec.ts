import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EjercicioTarjetaComponent } from './ejercicio-tarjeta.component';

describe('EjercicioTarjetaComponent', () => {
  let component: EjercicioTarjetaComponent;
  let fixture: ComponentFixture<EjercicioTarjetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EjercicioTarjetaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EjercicioTarjetaComponent);
    component = fixture.componentInstance;
  });

  it('Debería mostrar el nombre recibido', () => {
    component.nombre = 'Sentadilla';
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Sentadilla');
  });

  it('Debería usar la ruta de imagen recibida', () => {
    component.imagen = 'ruta/a/la/imagen.jpg';
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('img'))
      .nativeElement as HTMLImageElement;
    expect(img.src).toContain('ruta/a/la/imagen.jpg');
  });
});
