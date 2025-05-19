import { TestBed } from '@angular/core/testing';

import { InicioRutinaService } from './inicio-rutina.service';

describe('InicioRutina', () => {
  let service: InicioRutinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InicioRutinaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
