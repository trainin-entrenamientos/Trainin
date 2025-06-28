import { Component } from '@angular/core';
import { AuthService } from '../../../core/servicios/authServicio/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../../core/servicios/spotifyServicio/spotify.service';

@Component({
  selector: 'app-callback',
  standalone: false,
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent {
  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.spotifyService.exchangeCodeForToken(code).subscribe({
        next: (res) => {
          this.spotifyService.guardarTokens(
            res.access_token,
            res.refresh_token,
            res.expires_in
          );
          this.router.navigate(['planes']);
        },
        error: (err) => console.error('Error obteniendo token:', err)
      });
    }
  }
}
