import { Component } from '@angular/core';
import { AuthService } from '../../../core/servicios/authServicio/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  standalone: false,
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent {
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      this.authService.exchangeCodeForToken(code).subscribe({
        next: (res) => {
          console.log('Respuesta del backend:', res); 
          localStorage.setItem('spotify_token', res.access_token);
          localStorage.setItem('spotify_refresh_token', res.refresh_token);
          localStorage.setItem('spotify_expires_at', 
            (Date.now() + (res.expires_in * 1000)).toString()
          );
          this.router.navigate(['planes']);
        },
        error: (error) => {
          console.error('Error obteniendo token:', error);
        }
      });
    }
  }
}
