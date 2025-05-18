import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-realizar-ejercicio-por-tiempo',
  standalone: false,
  templateUrl: './realizar-ejercicio-por-tiempo.component.html',
  styleUrl: './realizar-ejercicio-por-tiempo.component.css'
})

export class RealizarEjercicioPorTiempoComponent implements OnInit, OnDestroy {
  @ViewChild('exerciseVideo', { static: true })
  exerciseVideo!: ElementRef<HTMLIFrameElement>;

  @ViewChild('sessionCard', { static: true })
  sessionCard!: ElementRef<HTMLElement>;

  durations = [30];
  totalTime = 0;
  remaining = 0;
  isPaused = false;
  intervalId: any;

  get elapsedTimeDisplay(): string {
  return this.fmt(this.totalTime - this.remaining);
}

get isWarning(): boolean {
  return this.remaining <= 10;
}

  get totalTimeDisplay(): string { return this.fmt(this.totalTime); }
  get countdownDisplay(): string { return this.fmt(this.remaining); }
  get progressPercent(): number {
  return ((this.totalTime - this.remaining) / this.totalTime) * 100;
}

  ngOnInit(): void {
    this.totalTime = this.durations.reduce((a, b) => a + b, 0);
    this.remaining = this.durations[0];
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private fmt(seconds: number): string {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  private startTimer(): void {
    this.intervalId = setInterval(() => {
      if (!this.isPaused && this.remaining > 0) {
        this.remaining--;
      }
      if (this.remaining <= 0) {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  closeSession(): void {
    clearInterval(this.intervalId);
    this.sessionCard.nativeElement.style.display = 'none';
  }
}
