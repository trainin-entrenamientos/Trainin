import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearPlanEntrenamientoComponent } from './vistas/crear-plan-entrenamiento/crear-plan-entrenamiento.component';
import { TerminosCondicionesComponent } from './vistas/terminos-condiciones/terminos-condiciones.component';
import { PoliticasPrivacidadComponent } from './vistas/politicas-privacidad/politicas-privacidad.component';
import { PreguntasFrecuentesComponent } from './vistas/preguntas-frecuentes/preguntas-frecuentes.component';
import { LayoutComponent } from './compartido/componentes/layout/layout.component';
import { NosotrosComponent } from './vistas/nosotros/nosotros.component';
import { FormularioCrearPlanDeEntrenamientoComponent } from './vistas/formulario-crear-plan-de-entrenamiento/formulario-crear-plan-de-entrenamiento.component';
import { HomeAdminComponent } from './vistas/home-admin/home-admin.component';
import { CrearEjercicioComponent } from './vistas/crear-ejercicio/crear-ejercicio.component';
import { EditarEjercicioComponent } from './vistas/editar-ejercicio/editar-ejercicio.component';
import { CorreccionPosturaComponent } from './vistas/correccion-postura/correccion-postura.component';

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
        path: 'formulario-crear-plan',
        component: FormularioCrearPlanDeEntrenamientoComponent
       },
      {
        path: 'home-admin',
        component: HomeAdminComponent
      },
      {
        path: 'crear-ejercicio',
        component: CrearEjercicioComponent
      },
      {
        path: 'editar-ejercicio/:id',
        component: EditarEjercicioComponent
      },
      {
        path: 'correccion-postura',
        component: CorreccionPosturaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
