// timer.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TemporizadorService {
  private elapsedSeconds = 0;
  private intervalId: any = null;
  private isRunning = false;

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.elapsedSeconds++;
    }, 1000);
  }

 pause() {
  if (!this.isRunning) return;
  clearInterval(this.intervalId);
  this.isRunning = false;
}

resume() {
  if (this.isRunning) return;
  this.isRunning = true;
  this.intervalId = setInterval(() => {
    this.elapsedSeconds++;
  }, 1000);
}


  reset() {
    this.pause(); // detener primero
    this.elapsedSeconds = 0;
  }

  getElapsedSeconds(): number {
    return this.elapsedSeconds;
  }

  isTimerRunning(): boolean {
    return this.isRunning;
  }
}
