import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EjercicioService } from './ejercicio-servicio.service';

describe('EjercicioServicioService', () => {
  let service: EjercicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,    
      ],
      providers: [
        EjercicioService,
      ]
    });
    service = TestBed.inject(EjercicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
