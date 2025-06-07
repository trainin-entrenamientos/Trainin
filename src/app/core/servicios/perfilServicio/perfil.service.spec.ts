import { TestBed } from '@angular/core/testing';

import { PerfilService } from './perfil.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PerfilServicio', () => {
  let service: PerfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PerfilService]
    });
    service = TestBed.inject(PerfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
