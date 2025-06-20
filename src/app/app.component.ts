import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from './core/servicios/notificacionesServicio/notificaciones.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'trainin';

  constructor(
    private notificacionServicio: NotificacionesService,
    private toastr: ToastrService
  ) {}
  
  ngOnInit() {
    this.notificacionServicio.message$.subscribe(msg => {
      if (msg?.notification) {
        const { title, body } = msg.notification;
        this.toastr.info(body, title);
      }
    });
  }
}
