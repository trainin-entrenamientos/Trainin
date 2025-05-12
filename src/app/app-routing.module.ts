import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearPlanEntrenamientoComponent } from './vistas/crear-plan-entrenamiento/crear-plan-entrenamiento.component';
import { TerminosCondicionesComponent } from './vistas/terminos-condiciones/terminos-condiciones.component';

const routes: Routes = [
  {
    path: '',
    component: CrearPlanEntrenamientoComponent,
  },
  {
    path: 'terminos-condiciones',
    component: TerminosCondicionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
