import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './componentes/layout/layout.component';
import { ModalEliminarEjercicioComponent } from './componentes/modales/modal-eliminar-ejercicio/modal-eliminar-ejercicio.component';
import { EjercicioTarjetaComponent } from './componentes/ejercicio-tarjeta/ejercicio-tarjeta.component';
import { CrearPlanModalComponent } from './componentes/modales/crear-plan-modal/crear-plan-modal.component';
import { ModalPlanCreadoComponent } from './componentes/modales/modal-plan-creado/modal-plan-creado.component';
import { LoaderComponent } from './componentes/loader/loader.component';
import { TemporizadorComponent } from './componentes/temporizador/temporizador.component';
import { BotonTraininComponent } from './componentes/boton-trainin/boton-trainin.component';
import { TarjetasPlanesComponent } from './componentes/tarjetas-planes/tarjetas-planes.component';
import { LogroObtenidoComponent } from './componentes/logro-obtenido/logro-obtenido.component';
import { ModalConfirmacionBorrarPlanComponent } from './componentes/modales/modal-confirmacion-borrar-plan/modal-confirmacion-borrar-plan.component';
import { ModalSalirDeRutinaComponent } from './componentes/modales/modal-salir-de-rutina/modal-salir-de-rutina.component';
import { ModalEditarPerfilComponent } from './componentes/modales/modal-editar-perfil/modal-editar-perfil.component';
import { ToastrModule } from 'ngx-toastr';
import { SpotifyComponent } from "./componentes/spotify/spotify.component";
import { ModalCambiarContraseniaComponent } from './componentes/modales/modal-cambiar-contrasenia/modal-cambiar-contrasenia.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    ModalEliminarEjercicioComponent,
    EjercicioTarjetaComponent,
    CrearPlanModalComponent,
    ModalPlanCreadoComponent,
    LoaderComponent,
    TemporizadorComponent,
    BotonTraininComponent,
    TarjetasPlanesComponent,
    LogroObtenidoComponent,
    ModalConfirmacionBorrarPlanComponent,
    ModalSalirDeRutinaComponent,
    ModalEditarPerfilComponent,
    SpotifyComponent,
    ModalCambiarContraseniaComponent,
  ],
  
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ],
  
  exports: [
    HeaderComponent,
    FooterComponent,
    ModalEliminarEjercicioComponent,
    EjercicioTarjetaComponent,
    CrearPlanModalComponent,
    ModalPlanCreadoComponent,
    LoaderComponent,
    TemporizadorComponent,
    BotonTraininComponent,
    TarjetasPlanesComponent,
    LogroObtenidoComponent,
    ModalConfirmacionBorrarPlanComponent,
    ModalSalirDeRutinaComponent,
    SpotifyComponent
  ],
  providers: [],
})
export class CompartidoModule {}
