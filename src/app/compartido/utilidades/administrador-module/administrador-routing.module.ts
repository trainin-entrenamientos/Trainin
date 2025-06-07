import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioAdminComponent }    from '../../../vistas/inicio-admin/inicio-admin.component';
import { EjerciciosFormComponent } from '../../../vistas/ejercicios-formulario/ejercicios-formulario.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'ejercicios',            component: InicioAdminComponent },
      { path: 'ejercicios/crear',      component: EjerciciosFormComponent },
      { path: 'ejercicios/editar/:id', component: EjerciciosFormComponent }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AdministradorRoutingModule { }
