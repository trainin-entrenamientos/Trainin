/*import { TestBed } from '@angular/core/testing';
import { SpotifyService } from './spotify.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('SpotifyService', () => {
  let servicio: SpotifyService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['post', 'put']);

    TestBed.configureTestingModule({
      providers: [
        SpotifyService,
        { provide: HttpClient, useValue: spy }
      ]
    });

    servicio = TestBed.inject(SpotifyService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;

    localStorage.clear();
  });

  it('debería crearse correctamente', () => {
    expect(servicio).toBeTruthy();
  });

  it('loginWithSpotify debería redirigir a la URL de autenticación de Spotify', () => {
  (servicio as any).clientId = 'clientePrueba';
  (servicio as any).redirectUri = 'http://localhost/callback';

  spyOn(window, 'encodeURIComponent').and.callFake((v: string | number | boolean) => String(v));

  let hrefSet = '';
  spyOnProperty(window.location, 'href', 'set').and.callFake((v: string) => {
    hrefSet = v;
  });

  servicio.loginWithSpotify();

  expect(hrefSet).toBeTruthy();
  expect(hrefSet).toContain('https://accounts.spotify.com/authorize');
  expect(hrefSet).toContain('client_id=clientePrueba');
  expect(hrefSet).toContain('redirect_uri=http://localhost/callback');
});
*/



  /*it('loginWithSpotify debería redirigir a la URL de autenticación de Spotify', () => {
    (servicio as any).clientId = 'clientePrueba';
    (servicio as any).redirectUri = 'http://localhost/callback';

    spyOn(window, 'encodeURIComponent').and.callFake((v: string | number | boolean) => String(v));
    spyOnProperty(window, 'location').and.returnValue({ href: '' } as any);
    const setHrefSpy = spyOnProperty(window.location, 'href', 'set');

    servicio.loginWithSpotify();

    expect(setHrefSpy).toHaveBeenCalled();
    const url = setHrefSpy.calls.mostRecent().args[0] as string;
    expect(url).toContain('https://accounts.spotify.com/authorize');
    expect(url).toContain('client_id=clientePrueba');
    expect(url).toContain('redirect_uri=http://localhost/callback');
  });*/
/*
  it('exchangeCodeForToken debería llamar a http.post con el código', () => {
    httpClientSpy.post.and.returnValue(of({ token: '123' }));
    const codigo = 'codigoDePrueba';

    servicio.exchangeCodeForToken(codigo).subscribe(respuesta => {
      expect(respuesta).toEqual({ token: '123' });
    });

    expect(httpClientSpy.post).toHaveBeenCalledWith(
      jasmine.stringMatching(/\/spotify\/intercambio$/),
      { code: codigo }
    );
  });

  it('guardarTokens debería guardar tokens en localStorage', () => {
    servicio.guardarTokens('accessTokenPrueba', 'refreshTokenPrueba', 3600);

    expect(localStorage.getItem('spotify_token')).toBe('accessTokenPrueba');
    expect(localStorage.getItem('spotify_refresh_token')).toBe('refreshTokenPrueba');

    const fechaExpiracion = localStorage.getItem('spotify_expires_at');
    expect(Number(fechaExpiracion)).toBeGreaterThan(Date.now());
  });

  it('getAccessToken debería devolver el token almacenado', () => {
    localStorage.setItem('spotify_token', 'accessTokenGuardado');
    const token = servicio.getAccessToken();
    expect(token).toBe('accessTokenGuardado');
  });

  it('isTokenExpired debería devolver true si no hay fecha de expiración', () => {
    expect(servicio.isTokenExpired()).toBeTrue();
  });

  it('isTokenExpired debería devolver false si el token aún no expiró', () => {
    const futuro = (Date.now() + 60000).toString(); 
    localStorage.setItem('spotify_expires_at', futuro);
    expect(servicio.isTokenExpired()).toBeFalse();
  });

  it('isTokenExpired debería devolver true si el token ya expiró', () => {
    const pasado = (Date.now() - 60000).toString(); // 1 minuto en el pasado
    localStorage.setItem('spotify_expires_at', pasado);
    expect(servicio.isTokenExpired()).toBeTrue();
  });

  it('logoutFromSpotify debería eliminar los tokens del localStorage', () => {
    localStorage.setItem('spotify_token', 't');
    localStorage.setItem('spotify_refresh_token', 'r');
    localStorage.setItem('spotify_expires_at', 'e');

    servicio.logoutFromSpotify();

    expect(localStorage.getItem('spotify_token')).toBeNull();
    expect(localStorage.getItem('spotify_refresh_token')).toBeNull();
    expect(localStorage.getItem('spotify_expires_at')).toBeNull();
  });

  it('getCurrentPlayback debería devolver el JSON si la respuesta es correcta', async () => {
    const respuestaMock = { json: () => Promise.resolve({ cancion: 'prueba' }), ok: true };
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(respuestaMock as any));

    const resultado = await servicio.getCurrentPlayback('tokenPrueba');
    expect(resultado).toEqual({ cancion: 'prueba' });
    expect(window.fetch).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/me/player/currently-playing',
      jasmine.any(Object)
    );
  });

  it('getCurrentPlayback debería lanzar un error si la respuesta no es ok', async () => {
    const respuestaMock = { ok: false };
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(respuestaMock as any));

    await expectAsync(servicio.getCurrentPlayback('tokenPrueba'))
      .toBeRejectedWithError('No se pudo obtener la canción actual');
  });

  it('transferPlaybackHere debería lanzar error si no hay token', () => {
    spyOn(servicio, 'getAccessToken').and.returnValue(null);

    servicio.transferPlaybackHere('idDispositivo').subscribe({
      error: (error) => {
        expect(error.message).toBe('Token no disponible');
      }
    });
  });

  it('transferPlaybackHere debería llamar a http.put si hay token', () => {
    spyOn(servicio, 'getAccessToken').and.returnValue('tokenPrueba');
    httpClientSpy.put.and.returnValue(of({ ok: true }));

    servicio.transferPlaybackHere('idDispositivo').subscribe(respuesta => {
      expect(respuesta).toEqual({ ok: true });
    });

    expect(httpClientSpy.put).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/me/player',
      { device_ids: ['idDispositivo'], play: false },
      jasmine.objectContaining({
        headers: jasmine.any(Object)
      })
    );
  });
});*/