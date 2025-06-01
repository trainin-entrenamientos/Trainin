import { TestBed } from '@angular/core/testing';

import { FabricaManejadoresService } from './fabrica-manejadores.service';

describe('FabricaManejadoresService', () => {
  let service: FabricaManejadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FabricaManejadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
