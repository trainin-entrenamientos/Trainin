import { Component,
         AfterViewInit,
         ViewChild,
         ElementRef,
         HostListener } from '@angular/core';

declare const bootstrap: any;

@Component({
  selector: 'home-landing-page',
  templateUrl: 'home-landing-page.component.html',
  styleUrls: ['home-landing-page.component.css'],
  standalone: false,
})

export class HomeLandingPageComponent implements AfterViewInit {
  @ViewChild('heroCarousel', { static: true }) heroCarousel!: ElementRef;
  @ViewChild('galleryRow',    { static: true }) galleryRow!:    ElementRef;

  private correctionInitialized = false;
  private readonly SCREEN_MAX = 992;

  ngAfterViewInit(): void {

    new bootstrap.Carousel(this.heroCarousel.nativeElement, {
      interval: 3000, ride: 'carousel', pause: false, wrap: true
    });

    this.toggleCorrectionCarousel();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.toggleCorrectionCarousel();
  }

  private toggleCorrectionCarousel(): void {
    const isSmall = window.innerWidth <= this.SCREEN_MAX;
    const galleryEl = this.galleryRow.nativeElement as HTMLElement;

    if (isSmall && !this.correctionInitialized) {
      
      const carousel = document.createElement('div');
      carousel.className = 'carousel slide carousel-fade';
      carousel.setAttribute('data-bs-ride', 'carousel');
      carousel.setAttribute('data-bs-interval', '3000');

      const inner = document.createElement('div');
      inner.className = 'carousel-inner';

      Array.from(galleryEl.querySelectorAll('.col-md-4')).forEach((col, i) => {
        galleryEl.removeChild(col);
        const item = document.createElement('div');
        item.className = 'carousel-item' + (i === 0 ? ' active' : '');
        item.appendChild(col);
        inner.appendChild(item);
      });

      carousel.appendChild(inner);
      galleryEl.parentNode!.replaceChild(carousel, galleryEl);

      new bootstrap.Carousel(carousel, {
        interval: 3000, ride: 'carousel', pause: false, wrap: true
      });

      this.correctionInitialized = true;
    }
    else if (!isSmall && this.correctionInitialized) {
    
      window.location.reload();
    }
  }
}
