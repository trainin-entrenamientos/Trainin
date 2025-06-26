import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  @Input() message = 'Cargando…';
}
