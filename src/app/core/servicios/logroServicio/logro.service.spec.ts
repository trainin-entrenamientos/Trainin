import { TestBed } from '@angular/core/testing';
import { PerfilService } from '../perfilServicio/perfil.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LogroService } from './logro.service';

describe('LogroServicioService', () => {
  let service: LogroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PerfilService]
    });
    service = TestBed.inject(LogroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
