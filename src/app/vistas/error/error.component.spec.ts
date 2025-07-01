import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    const cont = document.querySelector('.cont_principal');
    if (cont && cont.parentNode === document.body) {
      document.body.removeChild(cont);
    }
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

 
  it('ngOnInit no debe fallar si no existe elemento con clase cont_principal', () => {
    const exist = document.querySelector('.cont_principal');
    if (exist && exist.parentNode === document.body) {
      document.body.removeChild(exist);
    }

    expect(() => component.ngOnInit()).not.toThrow();
  });
});