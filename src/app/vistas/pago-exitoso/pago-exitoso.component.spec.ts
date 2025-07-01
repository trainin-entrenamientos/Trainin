import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoExitosoComponent } from './pago-exitoso.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('PagoExitosoComponent', () => {
  let component: PagoExitosoComponent;
  let fixture: ComponentFixture<PagoExitosoComponent>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock del Router
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      declarations: [PagoExitosoComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoExitosoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería navegar a "/planes" al inicializar el componente', () => {
    expect(routerMock.navigate).toHaveBeenCalledWith(['/planes']);
  });

  it('debería renderizar el mensaje "pago-exitoso works!"', () => {
    const pElement = fixture.debugElement.query(By.css('p'));
    expect(pElement.nativeElement.textContent).toContain('pago-exitoso works!');
  });
});
