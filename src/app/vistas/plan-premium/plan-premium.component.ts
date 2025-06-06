import { AfterViewInit, Component, ElementRef, ViewChildren, QueryList, NgModule } from '@angular/core';
import { AuthService } from '../../core/servicios/authServicio/auth.service';

@Component({
  selector: 'app-premium',
  standalone: false,
  templateUrl: './plan-premium.component.html',
  styleUrls: ['./plan-premium.component.css']
})
export class PlanPremiumComponent implements AfterViewInit {
  @ViewChildren('cardFeature') cardFeatures!: QueryList<ElementRef<HTMLDivElement>>;
  rutaSuscripcion: string = '';

  constructor(public authService: AuthService){}

      ngOnInit() {
        this.rutaSuscripcion = this.estaLogueado() ? '/planes' : '/registro';
      }
      
  ngAfterViewInit() {
    const options = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, options);

    this.cardFeatures.forEach(cardEl => {
      observer.observe(cardEl.nativeElement);
    });
  }

  estaLogueado(): boolean {
    return this.authService.estaAutenticado();
  }
}
