import { TestBed } from '@angular/core/testing';

import { TemporizadorService } from './temporizador.service';

describe('TemporizadorService', () => {
  let service: TemporizadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemporizadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
