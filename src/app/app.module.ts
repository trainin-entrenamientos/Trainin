import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompartidoModule } from './compartido/compartido.module';
import { VistasModule } from './vistas/vistas.module';
import { provideHttpClient } from '@angular/common/http';
import { NosotrosComponent } from './vistas/nosotros/nosotros.component';

@NgModule({
  declarations: [
    AppComponent,
    CrearPlanEntrenamientoComponent,
    TerminosCondicionesComponent,
    PoliticasPrivacidadComponent,
    PreguntasFrecuentesComponent,
    NosotrosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CompartidoModule,
    VistasModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
