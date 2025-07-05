import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
  sequence,
  state,
} from '@angular/animations';
import { ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';

declare const bootstrap: any;

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.component.html',
  styleUrls: ['inicio.component.css'],
  standalone: false,
  animations: [
    trigger('fadeInStagger', [
      transition(':enter', [
        query(
          '.fade-element',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(200, [
              animate(
                '600ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('slideIn', [
      state('hidden', style({ opacity: 0, transform: 'translateY(40px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden <=> visible', animate('800ms ease-out')),
    ]),
    trigger('fadeZoomStagger', [
      transition('hidden => visible', [
        sequence([
          query(
            '.marker-label, .fade-marker:not(.marker-label)',
            [style({ opacity: 0, transform: 'scale(0.5)' })],
            { optional: true }
          ),

          query('.marker-label', [stagger(200, [animate('500ms ease-out')])], {
            optional: true,
          }),

          query(
            '.fade-marker:not(.marker-label)',
            [
              stagger(200, [
                animate(
                  '500ms ease-out',
                  style({ opacity: 1, transform: 'scale(1)' })
                ),
              ]),
            ],
            { optional: true }
          ),
        ]),
      ]),
    ]),
    trigger('sectionLift', [
      state(
        'hidden',
        style({ opacity: 0, transform: 'translateY(60px) scale(0.97)' })
      ),
      state(
        'visible',
        style({ opacity: 1, transform: 'translateY(0) scale(1)' })
      ),
      transition('hidden <=> visible', animate('1000ms ease-out')),
    ]),
    trigger('subscriptionStagger', [
      transition(':enter', [
        query(
          '.subscription-card',
          [
            style({ opacity: 0, transform: 'translateY(30px)' }),
            stagger(200, [
              animate(
                '1500ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('timelineStagger', [
      state('hidden', style({})),
      state('visible', style({})),
      transition('hidden <=> visible', [
        query(
          '.timeline-row .col',
          [
            stagger(300, [
              sequence([
                query(
                  '.marker-label',
                  [
                    style({ opacity: 0 }),
                    animate('600ms ease-out', style({ opacity: 1 })),
                  ],
                  { optional: true }
                ),
                query(
                  '.step-title, .step-text',
                  [
                    style({ opacity: 0 }),
                    animate('600ms ease-out', style({ opacity: 1 })),
                  ],
                  { optional: true }
                ),
              ]),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('benefitItem', [
      state('hidden', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden <=> visible', [animate('600ms ease-out')]),
    ]),
  ],
})
export class InicioComponent implements AfterViewInit {
  constructor(private cd: ChangeDetectorRef) { }
  [x: string]: any;
  @ViewChild('heroCarousel', { static: true }) heroCarousel!: ElementRef;
  @ViewChild('galleryRow', { static: true }) galleryRow!: ElementRef;
  @ViewChild('heroSection', { static: true }) heroSection!: ElementRef;
  @ViewChild('whySection', { static: true }) whySection!: ElementRef;
  @ViewChild('whyItem1', { static: true }) whyItem1!: ElementRef;
  @ViewChild('whyItem2', { static: true }) whyItem2!: ElementRef;
  @ViewChild('whyItem3', { static: true }) whyItem3!: ElementRef;
  @ViewChild('correctionSection', { static: true })
  correctionSection!: ElementRef;
  @ViewChild('subscriptionSection', { static: true })
  subscriptionSection!: ElementRef;
  @ViewChild('whyTitle', { static: true }) whyTitle!: ElementRef;

  correctionVisible = false;
  subscriptionVisible = false;
  slideWhyItems: ('hidden' | 'visible')[] = ['hidden', 'hidden', 'hidden'];
  slideWhyTitle: 'hidden' | 'visible' = 'hidden';
  sectionVisible = false;
  private correctionInitialized = false;
  private readonly SCREEN_MAX = 992;

  @ViewChildren('benefitItem', { read: ElementRef })
  benefitItems!: QueryList<ElementRef>;
  benefitVisible: boolean[] = [];

  ngAfterViewInit(): void {
    new bootstrap.Carousel(this.heroCarousel.nativeElement, {
      interval: 3000,
      ride: 'carousel',
      pause: false,
      wrap: true,
    });

    this.toggleCorrectionCarousel();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.sectionVisible = true;
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(this.heroSection.nativeElement);

    const options = { threshold: 0.3 };

    const observer1 = new IntersectionObserver(([entry]) => {
      this.slideWhyItems[0] = entry.isIntersecting ? 'visible' : 'hidden';
    }, options);

    const observer2 = new IntersectionObserver(([entry]) => {
      this.slideWhyItems[1] = entry.isIntersecting ? 'visible' : 'hidden';
    }, options);

    const observer3 = new IntersectionObserver(([entry]) => {
      this.slideWhyItems[2] = entry.isIntersecting ? 'visible' : 'hidden';
    }, options);

    observer1.observe(this.whyItem1.nativeElement);
    observer2.observe(this.whyItem2.nativeElement);
    observer3.observe(this.whyItem3.nativeElement);

    const observerCorrection = new IntersectionObserver(
      ([entry]) => {
        const r = entry.intersectionRatio;
        if (!this.correctionVisible && r >= 0.25) {
          this.correctionVisible = true;
        } else if (this.correctionVisible && r < 0.15) {
          this.correctionVisible = false;
        }
      },
      {
        threshold: [0, 0.15, 0.25],
      }
    );
    observerCorrection.observe(this.correctionSection.nativeElement);
    const observerSubscription = new IntersectionObserver(
      ([entry]) => {
        this.subscriptionVisible = entry.isIntersecting;
      },
      { threshold: 0.3 }
    );
    observerSubscription.observe(this.subscriptionSection.nativeElement);

    this.benefitVisible = this.benefitItems.toArray().map((_) => false);
    this.benefitItems.forEach((el, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          this.benefitVisible[i] = entry.isIntersecting;
          this.cd.detectChanges();
        },
        { threshold: 0.3 }
      );
      obs.observe(el.nativeElement);
    });

    const titleObserver = new IntersectionObserver(
      ([entry]) => {
        this.slideWhyTitle = entry.isIntersecting ? 'visible' : 'hidden';
        this.cd.detectChanges();
      },
      { threshold: 0.3 }
    );
    titleObserver.observe(this.whyTitle.nativeElement);
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
        interval: 3000,
        ride: 'carousel',
        pause: false,
        wrap: true,
      });

      this.correctionInitialized = true;
    } else if (!isSmall && this.correctionInitialized) {
      setTimeout(() => window.location.reload(), 300);
    }
  }
}
