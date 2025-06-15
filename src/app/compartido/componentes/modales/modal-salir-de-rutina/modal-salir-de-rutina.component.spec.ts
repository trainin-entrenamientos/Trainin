import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalSalirDeRutinaComponent } from './modal-salir-de-rutina.component';
import { CompartidoModule } from '../../../compartido.module';

describe('ModalSalirDeRutinaComponent', () => {
  let component: ModalSalirDeRutinaComponent;
  let fixture: ComponentFixture<ModalSalirDeRutinaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSalirDeRutinaComponent],
      imports: [CompartidoModule],
    });

    fixture = TestBed.createComponent(ModalSalirDeRutinaComponent);
    component = fixture.componentInstance;
  });

  function dadoQueElModalEstaVisible() {
    component.visible = true;
    fixture.detectChanges();
  }

  function dadoQueElModalTieneUnMensajePersonalizado(mensaje: string) {
    component.mensaje = mensaje;
    fixture.detectChanges();
  }

  function cuandoSeConfirmaElModal() {
    component.confirmar();
  }

  function cuandoSeCancelaElModal() {
    component.cancelar();
  }

  function entoncesDebeEmitirseElEventoOnConfirm(done: DoneFn) {
    component.onConfirm.subscribe(() => {
      expect(true).toBeTrue();
      done();
    });
    cuandoSeConfirmaElModal();
  }

  function entoncesDebeEmitirseElEventoOnCancel(done: DoneFn) {
    component.onCancel.subscribe(() => {
      expect(true).toBeTrue();
      done();
    });
    cuandoSeCancelaElModal();
  }

  function entoncesDebeMostrarseElMensajeEsperado(mensajeEsperado: string) {
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain(mensajeEsperado);
  }

  it('debe emitir el evento onConfirm al confirmar', (done) => {
    entoncesDebeEmitirseElEventoOnConfirm(done);
  });

  it('debe emitir el evento onCancel al cancelar', (done) => {
    entoncesDebeEmitirseElEventoOnCancel(done);
  });

  it('debe mostrar el mensaje personalizado si se establece uno', () => {
    const mensaje = '¿Seguro que querés abandonar la rutina actual?';
    dadoQueElModalTieneUnMensajePersonalizado(mensaje);
    dadoQueElModalEstaVisible();
    entoncesDebeMostrarseElMensajeEsperado(mensaje);
  });

  it('debe mostrar el mensaje por defecto si no se establece uno personalizado', () => {
    dadoQueElModalEstaVisible();
    entoncesDebeMostrarseElMensajeEsperado(
      '¿Estás segur@ que querés salir de la rutina? Se perderá todo el progreso'
    );
  });
});
