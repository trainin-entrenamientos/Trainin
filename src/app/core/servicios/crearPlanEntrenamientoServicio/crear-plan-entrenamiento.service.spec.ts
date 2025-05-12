import { TestBed } from '@angular/core/testing';

import { CrearPlanEntrenamientoService } from './crear-plan-entrenamiento.service';

describe('CrearPlanEntrenamientoService', () => {
  let service: CrearPlanEntrenamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearPlanEntrenamientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
