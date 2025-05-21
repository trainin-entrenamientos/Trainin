import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './componentes/layout/layout.component';
import { ModalEliminarEjercicioComponent } from './componentes/modales/modal-eliminar-ejercicio/modal-eliminar-ejercicio.component';
import { EjercicioTarjetaComponent } from './componentes/ejercicio-tarjeta/ejercicio-tarjeta.component';
import { CrearPlanModalComponent } from './componentes/modales/crear-plan-modal/crear-plan-modal.component';
import { ModalPlanCreadoComponent } from './componentes/modales/modal-plan-creado/modal-plan-creado.component';
import { ModalReintentoCorreccionComponent } from './componentes/modales/modal-reintento-correccion/modal-reintento-correccion.component';
import { LoaderComponent } from './componentes/loader/loader.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    ModalEliminarEjercicioComponent,
    EjercicioTarjetaComponent,
    CrearPlanModalComponent,
    ModalPlanCreadoComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
    ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ModalEliminarEjercicioComponent,
    EjercicioTarjetaComponent,
    CrearPlanModalComponent,
    ModalPlanCreadoComponent,
    LoaderComponent
  ],
  providers: [],
})
export class CompartidoModule {}