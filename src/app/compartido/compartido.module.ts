import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './componentes/layout/layout.component';
import { ModalEliminarEjercicioComponent } from './componentes/modales/modal-eliminar-ejercicio/modal-eliminar-ejercicio.component';
import { EjercicioTarjetaComponent } from './componentes/ejercicio-tarjeta/ejercicio-tarjeta.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    ModalEliminarEjercicioComponent,
    EjercicioTarjetaComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ModalEliminarEjercicioComponent,
    EjercicioTarjetaComponent
  ],
  providers: [],
})
export class CompartidoModule {}