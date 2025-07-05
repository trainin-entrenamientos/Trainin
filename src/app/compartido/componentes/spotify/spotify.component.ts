import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { SpotifyService } from '../../../core/servicios/spotifyServicio/spotify.service';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

@Component({
  selector: 'app-spotify',
  standalone: false,
  templateUrl: './spotify.component.html',
  styleUrl: './spotify.component.css',
})
export class SpotifyComponent implements OnInit, OnDestroy {
  private player: any;
  isReady = false;
  token: string | null = null;
  currentTrack: any = null;
  isPlaying = false;
  position = 0;
  duration = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private spotifyService: SpotifyService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    if (this.spotifyService.isTokenExpired()) {
      console.warn('El token de Spotify expiró');
      return;
    }

    this.token = this.spotifyService.getAccessToken();
    if (!this.token) {
      console.error('No se encontró token de Spotify');
      return;
    }

    this.loadSDK();
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.disconnect();
    }
  }

  loadSDK(): void {
    window.onSpotifyWebPlaybackSDKReady = () => this.initPlayer();

    if (!document.getElementById('spotify-sdk')) {
      const script = document.createElement('script');
      script.id = 'spotify-sdk';
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      document.body.appendChild(script);
    } else {
      this.initPlayer();
    }
  }

  initPlayer(): void {
    if (!this.token) return;

    this.player = new window.Spotify.Player({
      name: 'Mi Reproductor de Entrenamiento',
      getOAuthToken: (cb: any) => cb(this.token),
      volume: 0.5
    });

    this.player.addListener('ready', ({ device_id }: any) => {
      console.log('Reproductor listo con ID:', device_id);
      
      this.ngZone.run(() => {
        this.isReady = true;
        
        this.spotifyService.transferPlaybackHere(device_id).subscribe({
          next: () => console.log('Reproducción transferida correctamente'),
          error: (error) => console.error('Error transfiriendo reproducción:', error)
        });
      });
    });

    this.player.addListener('not_ready', ({ device_id }: any) => {
      console.log('Device ID has gone offline', device_id);
      this.ngZone.run(() => {
        this.isReady = false;
      });
    });

    this.player.addListener(
      'player_state_changed',
      (state: any) => {
        if (!state) return;

        this.ngZone.run(() => {
          this.currentTrack = state.track_window.current_track;
          this.isPlaying = !state.paused;
          this.position = state.position;
          this.duration = state.duration;
        });
      }
    );

    this.player.addListener('initialization_error', ({ message }: any) => {
      console.error('Error de inicialización:', message);
    });

    this.player.addListener('authentication_error', ({ message }: any) => {
      console.error('Error de autenticación:', message);
    });

    this.player.addListener('account_error', ({ message }: any) => {
      console.error('Error de cuenta:', message);
    });

    this.player.addListener('playback_error', ({ message }: any) => {
      console.error('Error de reproducción:', message);
    });

    this.player.connect().then((success: boolean) => {
      if (success) {
        console.log('Conectado al reproductor de Spotify');
      } else {
        console.error('No se pudo conectar al reproductor');
      }
    });
  }

  togglePlay(): void {
    if (!this.player || !this.isReady) {
      console.warn('Reproductor no está listo');
      return;
    }

    this.player.getCurrentState().then((state: any) => {
      if (!state) {
        console.warn('No hay estado de reproducción disponible');
        return;
      }

      if (state.paused) {
        this.player.resume().then(() => {
          console.log('Reproducción reanudada');
        }).catch((error: any) => {
          console.error('Error reanudando reproducción:', error);
        });
      } else {
        this.player.pause().then(() => {
          console.log('Reproducción pausada');
        }).catch((error: any) => {
          console.error('Error pausando reproducción:', error);
        });
      }
    }).catch((error: any) => {
      console.error('Error obteniendo estado del reproductor:', error);
    });
  }

  previousTrack(): void {
    if (!this.player || !this.isReady) return;
    
    this.player.previousTrack().catch((error: any) => {
      console.error('Error yendo a la canción anterior:', error);
    });
  }

  nextTrack(): void {
    if (!this.player || !this.isReady) return;
    
    this.player.nextTrack().catch((error: any) => {
      console.error('Error yendo a la siguiente canción:', error);
    });
  }

  async getCurrentlyPlaying(): Promise<void> {
    if (!this.token) return;

    try {
      const data = await this.spotifyService.getCurrentPlayback(this.token);
      console.log('Canción actual:', data);
    } catch (err) {
      console.error('Error obteniendo canción actual:', err);
    }
  }
}