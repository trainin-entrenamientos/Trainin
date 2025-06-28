import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private clientId = environment.spotify.clientId;
  private redirectUri = environment.spotify.redirectUri;
  private baseUrl = environment.URL_BASE;

  constructor(private http: HttpClient) {}

  loginWithSpotify(): void {
    const scope = [
      'streaming',
      'user-read-email',
      'user-read-private',
      'user-modify-playback-state',
      'user-read-playback-state',
    ].join(' ');

    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${
      this.clientId
    }&redirect_uri=${encodeURIComponent(
      this.redirectUri
    )}&scope=${encodeURIComponent(scope)}`;
    window.location.href = url;
  }

  exchangeCodeForToken(code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/spotify/intercambio`, { code });
  }

  guardarTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number
  ): void {
    localStorage.setItem('spotify_token', accessToken);
    localStorage.setItem('spotify_refresh_token', refreshToken);
    localStorage.setItem(
      'spotify_expires_at',
      (Date.now() + expiresIn * 1000).toString()
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('spotify_token');
  }

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('spotify_expires_at');
    return !expiresAt || Date.now() > +expiresAt;
  }

  logoutFromSpotify(): void {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_expires_at');
  }

  async getCurrentPlayback(token: string): Promise<any> {
    const response = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('No se pudo obtener la canción actual');
    }
  }

  transferPlaybackHere(deviceId: string): Observable<any> {
    const token = this.getAccessToken();

    if (!token) {
      return throwError(() => new Error('Token no disponible'));
    }

    const body = {
      device_ids: [deviceId],
      play: false,
    };

    // Usar directamente la URL de Spotify API (no tu backend)
    return this.http.put('https://api.spotify.com/v1/me/player', body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
