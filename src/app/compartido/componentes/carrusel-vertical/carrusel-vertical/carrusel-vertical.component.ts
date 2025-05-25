import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
} from '@angular/core';

interface CarruselItem {
  tipo: 'texto' | 'imagen';
  contenido: string;
}

@Component({
  selector: 'app-carrusel-vertical',
  templateUrl: './carrusel-vertical.component.html',
  styleUrls: ['./carrusel-vertical.component.css'],
  standalone:false
})
export class CarruselVerticalComponent implements AfterViewInit {
  items: CarruselItem[] = [
    { tipo: 'texto', contenido: 'Ejercicio del día: Plancha' }, //desharcodear
    { tipo: 'imagen', contenido: '/imagenes/motivacion.jpeg' },
    { tipo: 'texto', contenido: 'Racha: 5 semanas' }, //desharcodear
    { tipo: 'imagen', contenido: '/imagenes/TRAININ-ISO-FO.svg' },
    { tipo: 'texto', contenido: 'Última rutina: Cuerpo completo' }, //desharcodear
    { tipo: 'imagen', contenido: '/imagenes/seguridad.jpeg' },
  ];

  @ViewChild('contenido') contenido!: ElementRef;
  scrollPos = 0;
  speed = 0.2; 
  velocity = 0; 
  isDragging = false;
  lastY = 0;
  selectedIndex: number | null = null;
  lastMouseDownY = 0;
  hasDragged = false;
  isPaused: boolean | undefined;
  esModoHorizontal = false;
  lastPos = 0;


ngAfterViewInit() {
  this.items = [...this.items, ...this.items, ...this.items];
  const contenidoEl = this.contenido.nativeElement;
  this.esModoHorizontal = window.innerWidth <= 768;
  const total = this.esModoHorizontal ? contenidoEl.scrollWidth : contenidoEl.scrollHeight;
  this.scrollPos = -total / 3; 
  this.animate();
  this.isPaused = false;
}

@HostListener('window:resize')
onResize() {
  this.esModoHorizontal = window.innerWidth <= 768;
}

animate() {
  if (this.isPaused) {
    requestAnimationFrame(() => this.animate());
    return;
  }

  this.scrollPos += this.speed + this.velocity;
  this.velocity *= 0.95;

  const contenidoEl = this.contenido.nativeElement;
  const total = this.esModoHorizontal ? contenidoEl.scrollWidth : contenidoEl.scrollHeight;

  if (this.scrollPos >= 0) {
    this.scrollPos = -total / 3;
  }

  if (this.esModoHorizontal) {
    contenidoEl.style.transform = `translateX(${this.scrollPos}px)`;
  } else {
    contenidoEl.style.transform = `translateY(${this.scrollPos}px)`;
  }

  requestAnimationFrame(() => this.animate());
}


onMouseDown(event: MouseEvent) {
  this.isDragging = true;
  this.lastPos = this.esModoHorizontal ? event.clientX : event.clientY;
  this.lastMouseDownY = this.lastPos;
  this.hasDragged = false;
}

onMouseMove(event: MouseEvent) {
  if (this.isDragging) {
    const current = this.esModoHorizontal ? event.clientX : event.clientY;
    const delta = current - this.lastPos;

    if (Math.abs(current - this.lastMouseDownY) > 5) {
      this.hasDragged = true;
    }

    this.velocity = delta * 0.2;
    this.lastPos = current;
  }
}

onMouseUp() {
  this.isDragging = false;
}

seleccionarItem(index: number) {
  if (this.hasDragged) return; 
  const contenidoEl = this.contenido.nativeElement;
  const totalItems = this.items.length / 3;
  const realIndex = index % totalItems;

  if (this.selectedIndex === realIndex) {
    this.selectedIndex = null;
    this.isPaused = false;
  } else {
    this.selectedIndex = realIndex;
    this.isPaused = true;
    this.velocity = 0;
  }
}

}
