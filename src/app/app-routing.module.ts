import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearPlanEntrenamientoComponent } from './vistas/crear-plan-entrenamiento/crear-plan-entrenamiento.component';
import { TerminosCondicionesComponent } from './vistas/terminos-condiciones/terminos-condiciones.component';
import { PoliticasPrivacidadComponent } from './vistas/politicas-privacidad/politicas-privacidad.component';
import { PreguntasFrecuentesComponent } from './vistas/preguntas-frecuentes/preguntas-frecuentes.component';
import { LayoutComponent } from './compartido/componentes/layout/layout.component';
import { NosotrosComponent } from './vistas/nosotros/nosotros.component';
import { HomeAdminComponent } from './vistas/home-admin/home-admin.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: CrearPlanEntrenamientoComponent
      },
      {
        path: 'crear-plan',
        component: CrearPlanEntrenamientoComponent
      },
      {
        path: 'terminos-condiciones',
        component: TerminosCondicionesComponent
      },
      {
        path: 'politicas-privacidad',
        component: PoliticasPrivacidadComponent
      },
      {
        path: 'preguntas-frecuentes',
        component: PreguntasFrecuentesComponent
      },
      {
        path: 'nosotros',
        component: NosotrosComponent
      },
      {
        path: 'home-admin',
        component: HomeAdminComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
