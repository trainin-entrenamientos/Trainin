import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { SpotifyService } from './spotify.service';
import { of } from 'rxjs';

describe('SpotifyService', () => {
  let service: SpotifyService;
  let httpMock: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpMock = jasmine.createSpyObj('HttpClient', ['post', 'put']);
    TestBed.configureTestingModule({
      providers: [
        SpotifyService,
        { provide: HttpClient, useValue: httpMock }
      ]
    });
    service = TestBed.inject(SpotifyService);
    localStorage.clear();
  });

  it('Debería guardar y recuperar tokens correctamente', () => {
    const access = 'A';
    const refresh = 'R';
    const expiresIn = 3600;

    service.guardarTokens(access, refresh, expiresIn);

    expect(localStorage.getItem('spotify_token')).toBe(access);
    expect(localStorage.getItem('spotify_refresh_token')).toBe(refresh);
    const expiresAt = +localStorage.getItem('spotify_expires_at')!;
    expect(expiresAt).toBeGreaterThan(Date.now());

    expect(service.getAccessToken()).toBe(access);
  });

  it('Debería detectar token expirado cuando no hay fecha', () => {
    expect(service.isTokenExpired()).toBeTrue();
  });

  it('Debería detectar token expirado cuando la fecha es pasada', () => {
    const past = Date.now() - 1000;
    localStorage.setItem('spotify_expires_at', past.toString());
    expect(service.isTokenExpired()).toBeTrue();
  });

  it('Debería detectar token válido cuando la fecha es futura', () => {
    const future = Date.now() + 100000;
    localStorage.setItem('spotify_expires_at', future.toString());
    expect(service.isTokenExpired()).toBeFalse();
  });

  it('Debería eliminar tokens al cerrar sesión', () => {
    localStorage.setItem('spotify_token', 'A');
    localStorage.setItem('spotify_refresh_token', 'R');
    localStorage.setItem('spotify_expires_at', '123');

    service.logoutFromSpotify();

    expect(localStorage.getItem('spotify_token')).toBeNull();
    expect(localStorage.getItem('spotify_refresh_token')).toBeNull();
    expect(localStorage.getItem('spotify_expires_at')).toBeNull();
  });

  describe('getCurrentPlayback', () => {
    it('Debería retornar datos cuando fetch ok', async () => {
      const mockJson = { song: 'X' };
      spyOn(window, 'fetch').and.returnValue(
        Promise.resolve({ ok: true, json: () => Promise.resolve(mockJson) } as any)
      );

      const result = await service.getCurrentPlayback('T');
      expect(result).toEqual(mockJson);
    });

    it('Debería lanzar error cuando fetch falla', async () => {
      spyOn(window, 'fetch').and.returnValue(
        Promise.resolve({ ok: false } as any)
      );

      await expectAsync(service.getCurrentPlayback('T')).toBeRejectedWithError(
        'No se pudo obtener la canción actual'
      );
    });
  });

  describe('transferPlaybackHere', () => {
    it('Debería fallar si no hay token', () => {
      service.logoutFromSpotify();
      service.getAccessToken();
      service.isTokenExpired();

      service.transferPlaybackHere('DEV').subscribe({
        next: () => fail('No debería emitir next'),
        error: err => expect(err.message).toBe('Token no disponible')
      });
    });

    it('Debería hacer PUT con token y body correcto', () => {
      const token = 'A';
      localStorage.setItem('spotify_token', token);
      const mockResponse = {};
      httpMock.put.and.returnValue(of(mockResponse));

      service.transferPlaybackHere('DEV').subscribe(res => {
        expect(res).toBe(mockResponse);
      });

      expect(httpMock.put).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/me/player',
        { device_ids: ['DEV'], play: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    });
  });

  it('Debería hacer POST al intercambiar código por token', () => {
    const fakeResp = { access: 'x', refresh: 'y' };
    httpMock.post.and.returnValue(of(fakeResp));

    service.exchangeCodeForToken('codigo123').subscribe(res => {
      expect(res).toBe(fakeResp);
    });

    expect(httpMock.post).toHaveBeenCalledWith(
      `${(service as any).baseUrl}/spotify/intercambio`,
      { code: 'codigo123' }
    );
  });

});