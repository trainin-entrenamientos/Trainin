import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

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
  styleUrl: './spotify.component.css'
})
export class SpotifyComponent implements OnInit {

  private player: any;
  isReady = false;
  token: string | null = null;
  currentTrack: any = null;
  isPlaying = false;
  position = 0;
  duration = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const expiresAt = localStorage.getItem('spotify_expires_at');
    if (!expiresAt || Date.now() > +expiresAt) {
      return;
    }
  
    this.token = localStorage.getItem('spotify_token');
  
    if (!this.token) {
      console.error('No se encontró token de Spotify');
      return;
    }
  
    this.loadSDK();
  }

  loadSDK(): void {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.onload = () => this.initPlayer();
    document.body.appendChild(script);
  }

  initPlayer(): void {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = localStorage.getItem('spotify_token');
      this.player = new window.Spotify.Player({
        name: 'Mi Reproductor de Entrenamiento',
        getOAuthToken: (cb: any) => { cb(token); },
        volume: 0.5
      });

      this.player.addListener('ready', ({ device_id }: any) => {
        this.isReady = true;
        this.transferPlaybackHere(token!, device_id);
        this.cdr.detectChanges();
      });
      this.player.addListener('player_state_changed', (state: { track_window: { current_track: any; }; paused: any; }) => {
        this.currentTrack = state.track_window.current_track;
        this.isPlaying = !state.paused;
      });

      this.player.connect();
    };
  }

  transferPlaybackHere(token: string, deviceId: string): void {
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      body: JSON.stringify({ device_ids: [deviceId], play: false }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }

  togglePlay(): void {
    if (!this.player) return;
  
    this.player.getCurrentState().then((state: { paused: any; }) => {
      if (!state) return;
  
      if (state.paused) {
        this.player.resume().then(() => this.isPlaying = true);
      } else {
        this.player.pause().then(() => this.isPlaying = false);
      }
    });
  }
  
  previousTrack(): void {
    this.player.previousTrack();
  }
  
  nextTrack(): void {
    this.player.nextTrack();
  }
  
  async getCurrentlyPlaying(): Promise<void> {
    if (!this.token) return;
    
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
      }
    } catch (error) {
      console.error('Error obteniendo canción actual:', error);
    }
  }
}
