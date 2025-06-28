import { TestBed } from '@angular/core/testing';
import { SpotifyService } from './spotify.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('SpotifyService', () => {
  let service: SpotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
