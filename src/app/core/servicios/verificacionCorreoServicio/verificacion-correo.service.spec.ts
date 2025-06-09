import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { VerificacionCorreoService } from './verificacion-correo.service';

describe('VerificacionCorreoService', () => {
  let service: VerificacionCorreoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],       
      providers: [ VerificacionCorreoService ]     
    });
    service = TestBed.inject(VerificacionCorreoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
