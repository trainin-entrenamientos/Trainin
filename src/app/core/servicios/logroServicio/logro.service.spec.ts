import { TestBed } from '@angular/core/testing';

import { LogroServicioService } from './logro-servicio.service';

describe('LogroServicioService', () => {
  let service: LogroServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogroServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
