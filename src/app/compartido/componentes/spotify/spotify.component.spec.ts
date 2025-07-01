import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';
import { SpotifyComponent } from './spotify.component';
import { SpotifyService } from '../../../core/servicios/spotifyServicio/spotify.service';
import { of } from 'rxjs';

describe('SpotifyComponent', () => {
  let component: SpotifyComponent;
  let fixture: ComponentFixture<SpotifyComponent>;
  let spotifyServiceMock: jasmine.SpyObj<SpotifyService>;
  let fakePlayer: any;
  let comp: any;

  beforeEach(() => {
    spotifyServiceMock = jasmine.createSpyObj('SpotifyService', [
      'isTokenExpired',
      'getAccessToken',
      'transferPlaybackHere',
      'getCurrentPlayback'
    ]);

    fakePlayer = {
      addListener: jasmine.createSpy('addListener'),
      connect: jasmine.createSpy('connect').and.returnValue(Promise.resolve(true)),
      disconnect: jasmine.createSpy('disconnect'),
      getCurrentState: jasmine.createSpy('getCurrentState'),
      resume: jasmine.createSpy('resume').and.returnValue(Promise.resolve()),
      pause: jasmine.createSpy('pause').and.returnValue(Promise.resolve()),
      previousTrack: jasmine.createSpy('previousTrack').and.returnValue(Promise.resolve()),
      nextTrack: jasmine.createSpy('nextTrack').and.returnValue(Promise.resolve())
    };

    (window as any).Spotify = {
      Player: class {
        constructor(opts: any) { return fakePlayer; }
      }
    };

    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [SpotifyComponent],
      providers: [
        { provide: SpotifyService, useValue: spotifyServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SpotifyComponent);
    component = fixture.componentInstance;
    comp = component as any;
  });

  it('Debería no inicializar Spotify si el token expiró', () => {
    spotifyServiceMock.isTokenExpired.and.returnValue(true);

    component.ngOnInit();

    expect(spotifyServiceMock.getAccessToken).not.toHaveBeenCalled();
    expect(component.isReady).toBeFalse();
  });

  it('Debería mostrar error si no hay token', () => {
    spotifyServiceMock.isTokenExpired.and.returnValue(false);
    spotifyServiceMock.getAccessToken.and.returnValue(null);
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('No se encontró token de Spotify');
    expect(component.isReady).toBeFalse();
  });

  it('Debería cargar el SDK cuando no existe el script', () => {
    spotifyServiceMock.isTokenExpired.and.returnValue(false);
    spotifyServiceMock.getAccessToken.and.returnValue('TOK');
    spyOn(document.body, 'appendChild');
    (document.getElementById as any) = jasmine.createSpy('getElementById').and.returnValue(null);

    component.ngOnInit();

    expect(document.body.appendChild).toHaveBeenCalledWith(jasmine.any(HTMLScriptElement));
  });

  it('Debería llamar initPlayer si el script ya existe', () => {
    spotifyServiceMock.isTokenExpired.and.returnValue(false);
    spotifyServiceMock.getAccessToken.and.returnValue('TOK');
    spyOn(component as any, 'initPlayer');
    (document.getElementById as any) = jasmine.createSpy('getElementById').and.returnValue({ id: 'spotify-sdk' });

    component.loadSDK();

    expect((component as any).initPlayer).toHaveBeenCalled();
  });

  it('Debería conectar el reproductor tras cargarse el SDK', fakeAsync(() => {
    spotifyServiceMock.isTokenExpired.and.returnValue(false);
    spotifyServiceMock.getAccessToken.and.returnValue('TOK');

    component.token = 'TOK';

    (document as any).getElementById = () => ({ id: 'spotify-sdk' } as any);

    component.loadSDK();

    flushMicrotasks();

    expect(fakePlayer.connect).toHaveBeenCalled();
  }));

  it('Debería marcar listo tras evento "ready" y transferir la reproducción', fakeAsync(() => {
    (document as any).getElementById = () => ({ id: 'spotify-sdk' } as any);

    spotifyServiceMock.isTokenExpired.and.returnValue(false);
    spotifyServiceMock.getAccessToken.and.returnValue('TOK');
    component.token = 'TOK';
    spotifyServiceMock.transferPlaybackHere.and.returnValue(of(void 0));

    component.loadSDK();

    const call = fakePlayer.addListener.calls.allArgs().find((args: any[]) => args[0] === 'ready');
    expect(call).toBeDefined();
    const readyCb = call![1] as (e: any) => void;

    readyCb({ device_id: 'DEV123' });
    flushMicrotasks();

    expect(component.isReady).toBeTrue();
    expect(spotifyServiceMock.transferPlaybackHere)
      .toHaveBeenCalledWith('DEV123');
  }));

  it('Debería manejar evento "not_ready" poniendo isReady en false', () => {

    (document as any).getElementById = () => ({ id: 'spotify-sdk' } as any);

    spotifyServiceMock.isTokenExpired.and.returnValue(false);
    spotifyServiceMock.getAccessToken.and.returnValue('TOK');
    component.token = 'TOK';

    component.loadSDK();

    const call = fakePlayer.addListener.calls.allArgs().find((args: any[]) => args[0] === 'not_ready');
    expect(call).toBeDefined();
    const notReadyCb = call![1] as (e: any) => void;

    component.isReady = true;
    notReadyCb({ device_id: 'DEV123' });
    expect(component.isReady).toBeFalse();
  });

  it('Debería actualizar estado al cambiar player_state_changed', () => {
    spotifyServiceMock.isTokenExpired.and.returnValue(false);
    spotifyServiceMock.getAccessToken.and.returnValue('TOK');
    component.token = 'TOK';

    (component as any).initPlayer();

    const call = fakePlayer.addListener.calls.allArgs().find((args: any[]) => args[0] === 'player_state_changed');
    expect(call).toBeDefined();
    const stateCb = call![1] as (state: any) => void;

    const fakeState = {
      track_window: { current_track: { name: 'Tema' } },
      paused: false,
      position: 5,
      duration: 100
    };
    stateCb(fakeState);

    expect(component.currentTrack).toEqual(fakeState.track_window.current_track);
    expect(component.isPlaying).toBeTrue();
    expect(component.position).toBe(5);
    expect(component.duration).toBe(100);
  });

  it('Debería pausar o reanudar según el estado en togglePlay', fakeAsync(() => {
    comp.player = fakePlayer;
    component.isReady = true;

    fakePlayer.getCurrentState.and.returnValue(Promise.resolve({ paused: true }));
    component.togglePlay();
    tick();
    expect(fakePlayer.resume).toHaveBeenCalled();

    fakePlayer.getCurrentState.and.returnValue(Promise.resolve({ paused: false }));
    component.togglePlay();
    tick();
    expect(fakePlayer.pause).toHaveBeenCalled();
  }));

  it('Debería advertir si intento togglePlay antes de listo', () => {
    spyOn(console, 'warn');
    comp.player = null;
    component.isReady = false;

    component.togglePlay();

    expect(console.warn).toHaveBeenCalledWith('Reproductor no está listo');
  });

  it('Debería ir a la anterior solo si está listo', () => {
    comp.player = fakePlayer;
    component.isReady = true;
    component.previousTrack();
    expect(fakePlayer.previousTrack).toHaveBeenCalled();

    comp.player = null;
    component.isReady = false;
    fakePlayer.previousTrack.calls.reset();
    component.previousTrack();
    expect(fakePlayer.previousTrack).not.toHaveBeenCalled();
  });

  it('Debería ir a la siguiente solo si está listo', () => {
    comp.player = fakePlayer;
    component.isReady = true;
    component.nextTrack();
    expect(fakePlayer.nextTrack).toHaveBeenCalled();

    comp.player = null;
    component.isReady = false;
    fakePlayer.nextTrack.calls.reset();
    component.nextTrack();
    expect(fakePlayer.nextTrack).not.toHaveBeenCalled();
  });

  it('Debería obtener la canción actual correctamente', async () => {
    component.token = 'TOK';
    spotifyServiceMock.getCurrentPlayback.and.returnValue(Promise.resolve({ item: 'canción' }));
    spyOn(console, 'log');

    await component.getCurrentlyPlaying();

    expect(console.log).toHaveBeenCalledWith('Canción actual:', { item: 'canción' });
  });

  it('Debería manejar error al obtener la canción actual', async () => {
    component.token = 'TOK';
    spotifyServiceMock.getCurrentPlayback.and.returnValue(Promise.reject('fail'));
    spyOn(console, 'error');

    await component.getCurrentlyPlaying();

    expect(console.error).toHaveBeenCalledWith('Error obteniendo canción actual:', 'fail');
  });

});