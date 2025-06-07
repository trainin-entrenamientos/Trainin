import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { InicioAdminComponent }      from '../../../vistas/inicio-admin/inicio-admin.component';
import { EjerciciosFormComponent }   from '../../../vistas/ejercicios-formulario/ejercicios-formulario.component';
import { CompartidoModule } from "../../compartido.module";

@NgModule({
  declarations: [
    InicioAdminComponent,
    EjerciciosFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdministradorRoutingModule,
    CompartidoModule
]
})
export class AdministradorModule { }
