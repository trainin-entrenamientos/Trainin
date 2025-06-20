import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  standalone: false,
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  ngOnInit(): void {
    const contPrincipal = document.querySelector('.cont_principal');
    if (contPrincipal) {
      contPrincipal.className = 'cont_principal cont_error_active';
    }
  }
}
