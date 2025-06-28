import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SpotifyComponent } from './spotify.component';
import { ChangeDetectorRef } from '@angular/core';

declare const window: any;

describe('SpotifyComponent', () => {
  let component: SpotifyComponent;
  let fixture: ComponentFixture<SpotifyComponent>;
  let cdr: ChangeDetectorRef;
  let originalFetch: any;

  beforeEach(() => {
    originalFetch = window.fetch;
    window.fetch = jasmine.createSpy('fetch').and.returnValue(Promise.resolve({}));

    TestBed.configureTestingModule({
      declarations: [SpotifyComponent],
      providers: [ChangeDetectorRef]
    }).compileComponents();

    fixture = TestBed.createComponent(SpotifyComponent);
    component = fixture.componentInstance;
    cdr = TestBed.inject(ChangeDetectorRef);

    spyOn(localStorage, 'getItem').and.callFake(key => {
      if (key === 'spotify_expires_at') return (Date.now() + 10000).toString();
      if (key === 'spotify_token') return 'token123';
      return null;
    });

    window.Spotify = {
      Player: jasmine.createSpy('Player').and.returnValue({
        addListener: jasmine.createSpy('addListener'),
        connect: jasmine.createSpy('connect'),
        getCurrentState: jasmine.createSpy('getCurrentState').and.returnValue(Promise.resolve({ paused: true })),
        resume: jasmine.createSpy('resume').and.returnValue(Promise.resolve()),
        pause: jasmine.createSpy('pause').and.returnValue(Promise.resolve()),
        previousTrack: jasmine.createSpy('previousTrack'),
        nextTrack: jasmine.createSpy('nextTrack')
      })
    };
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  it('Debería inicializar sin token o expirado y no llamar al SDK', () => {

    (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => null);
    component.ngOnInit();
    expect(component.token).toBeNull();
    expect(component.isReady).toBeFalse();
  });

  it('Debería cargar el SDK y crear el reproductor', fakeAsync(() => {

    const getItemSpy = (localStorage.getItem as jasmine.Spy);
    getItemSpy.calls.reset();
    getItemSpy.and.callFake((key: string) => {
      if (key === 'spotify_token') return 'token123';
      if (key === 'spotify_expires_at') return (Date.now() + 10000).toString();
      return null;
    });

    const fakeScript = document.createElement('script');
    spyOn(document, 'createElement').and.returnValue(fakeScript);
    spyOn(document.body, 'appendChild');

    const playerSpy = jasmine.createSpy('Player').and.returnValue({
      addListener: jasmine.createSpy('addListener'),
      connect: jasmine.createSpy('connect').and.returnValue(Promise.resolve(true))
    });
    (window as any).Spotify = { Player: playerSpy };

    component.ngOnInit();
    component.loadSDK();

    expect(typeof fakeScript.onload).toBe('function');
    fakeScript.onload!(new Event('load'));
    window.onSpotifyWebPlaybackSDKReady();

    tick();
    expect(playerSpy).toHaveBeenCalled();
    expect(component.isReady).toBeFalse();
  }));

  it('Debería transferir la reproducción al dispositivo splicitado', () => {
    const spyFetch = window.fetch as jasmine.Spy;
    component.transferPlaybackHere('token123', 'deviceId');
    expect(spyFetch).toHaveBeenCalledWith(
      'https://api.spotify.com/v1/me/player',
      jasmine.objectContaining({
        method: 'PUT',
        headers: jasmine.objectContaining({ 'Authorization': 'Bearer token123' })
      })
    );
  });

  it('Debería alternar play y pausa correctamente', fakeAsync(() => {

    component['player'] = window.Spotify.Player();
    component.togglePlay();
    tick();

    expect(component['player'].resume).toHaveBeenCalled();

    (component['player'].getCurrentState as jasmine.Spy).and.returnValue(Promise.resolve({ paused: false }));
    component.togglePlay();
    tick();
    expect(component['player'].pause).toHaveBeenCalled();
  }));

  it('Debería ir a anterior y siguiente canción', () => {
    component['player'] = window.Spotify.Player();
    component.previousTrack();
    expect(component['player'].previousTrack).toHaveBeenCalled();
    component.nextTrack();
    expect(component['player'].nextTrack).toHaveBeenCalled();
  });

  it('Debería obtener la canción actual sin token', fakeAsync(() => {
    component.token = null;
    spyOn(console, 'error');
    component.getCurrentlyPlaying();
    tick();
    expect(window.fetch).not.toHaveBeenCalled();
  }));

  it('Debería obtener la canción actual con token', fakeAsync(() => {
    component.token = 'token123';
    (window.fetch as jasmine.Spy).and.returnValue(Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
    component.getCurrentlyPlaying();
    tick();
    expect(window.fetch).toHaveBeenCalled();
  }));
});