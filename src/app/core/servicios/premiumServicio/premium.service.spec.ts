import { TestBed } from '@angular/core/testing';

import { PremiumServicioService } from './premium.service';

describe('PremiumServicioService', () => {
  let service: PremiumServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremiumServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
