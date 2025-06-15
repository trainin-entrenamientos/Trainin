import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MercadoPagoService } from './mercado-pago.service';

describe('MercadoPagoService', () => {
  let service: MercadoPagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MercadoPagoService],
    });
    service = TestBed.inject(MercadoPagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
