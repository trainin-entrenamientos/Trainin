import { Component } from '@angular/core';

@Component({
  selector: 'app-finalizacion-rutina',
  standalone: false,
  templateUrl: './finalizacion-rutina.component.html',
  styleUrl: './finalizacion-rutina.component.css'
})
export class FinalizacionRutinaComponent {
  ejercicios = [
    {nombre: 'Abdominales', imagen: '/imagenes/abdominales.jpg'},
    {nombre: 'Flexiones', imagen: '/imagenes/Flexiones.jpeg'},
    {nombre: 'Sentadillas', imagen: '/imagenes/Sentadilla.jpg'},
    {nombre: 'Plancha', imagen: '/imagenes/plancha.jpg'},
    {nombre: 'Abdominales', imagen: '/imagenes/abdominales.jpg'},
    {nombre: 'Flexiones', imagen: '/imagenes/Flexiones.jpeg'},
  ];
  estadisticas = [
    { label: 'Calorías Quemadas', valor: '120 cal' },
    { label: 'Duración Total', valor: '15 min' },
    { label: 'Estado Físico', valor: 'Excelente' },
    { label: 'Progreso Semanal', valor: '5/5 días' },
    { label: 'Logros Completados', valor: '2' },
  ];
}
