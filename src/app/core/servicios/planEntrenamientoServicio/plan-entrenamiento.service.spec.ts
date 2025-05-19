import { TestBed } from '@angular/core/testing';

import { PlanEntrenamientoService } from './plan-entrenamiento.service';

describe('CrearPlanEntrenamientoService', () => {
  let service: PlanEntrenamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanEntrenamientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
