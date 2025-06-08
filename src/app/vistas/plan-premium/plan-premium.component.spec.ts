import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanPremiumComponent } from './plan-premium.component';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PlanPremiumComponent', () => {
  let component: PlanPremiumComponent;
  let fixture: ComponentFixture<PlanPremiumComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['estaLogueado']);

    TestBed.configureTestingModule({
      declarations: [PlanPremiumComponent],
      providers: [{ provide: AuthService, useValue: spy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]  // para ignorar app-boton-trainin
    });

    fixture = TestBed.createComponent(PlanPremiumComponent);
    component = fixture.componentInstance;
    authServiceMock = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('debe redirigir a /planes si el usuario está logueado', () => {
    spyOn(component, 'estaLogueado').and.returnValue(true);


    fixture.detectChanges();

    expect(component.rutaSuscripcion).toBe('/planes');
  });

  it('debe redirigir a /registro si el usuario NO está logueado', () => {
    spyOn(component, 'estaLogueado').and.returnValue(false);

    fixture.detectChanges();

    expect(component.rutaSuscripcion).toBe('/registro');
  });
});
