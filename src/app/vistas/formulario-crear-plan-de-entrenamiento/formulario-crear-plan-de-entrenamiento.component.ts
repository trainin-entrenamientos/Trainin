import {
  AfterViewInit,
  Component,
  OnInit,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario-crear-plan-de-entrenamiento',
  standalone: false,
  templateUrl: './formulario-crear-plan-de-entrenamiento.component.html',
  styleUrl: './formulario-crear-plan-de-entrenamiento.component.css',
})
export class FormularioCrearPlanDeEntrenamientoComponent {
  currentStep: number = 1;
  totalSteps: number = 7;
  editandoDesdeResumen: boolean = false;
  formularioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.formularioForm = this.fb.group({
      peso: [null,Validators.required],
      altura: [null,Validators.required],
      objetivo: [null, Validators.required],
      frecuenciaActividad: [1, Validators.required],
      exigenciaActividad: [1, Validators.required],
      diasEntrenamiento: [1, Validators.required],
      duracionEntrenamiento: [1, Validators.required],
      duracionPlanDias: [1, Validators.required],
      // diasSemanales: [1, Validators.required],
      //duracionPlan: [1, Validators.required],
      tipoEntrenamiento: [null, Validators.required],
      equipamientoSeleccionado: [null, Validators.required],
    });
  }
  equipamientoSeleccionado: string[] = [];
  minutos: string = '';

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.currentStep === 3 || this.currentStep === 6) {
        this.configurarSliders();
      }
    });
  }

 nextStep(): void {
  if (!this.esPasoActualValido()) {
    // Marca los campos del paso actual como tocados para mostrar mensajes de error
    this.marcarCamposDelPasoComoTocados(this.currentStep);
    return;
  }

  if (this.currentStep < this.totalSteps) {
    this.currentStep++;
    if (this.currentStep === this.totalSteps) {
      this.cargarResumen();
    }

    if (this.currentStep === 3 || this.currentStep === 6) {
      setTimeout(() => this.configurarSliders(), 0);
    }
  }
}
marcarCamposDelPasoComoTocados(paso: number): void {
  const controles: string[] = [];

  switch (paso) {
    case 1:
      controles.push('peso', 'altura');
      break;
    case 2:
      controles.push('objetivo');
      break;
    case 3:
      controles.push('frecuenciaActividad', 'exigenciaActividad');
      break;
    case 4:
      controles.push('tipoEntrenamiento');
      break;
    case 5:
      controles.push('equipamientoSeleccionado');
      break;
    case 6:
      controles.push('diasEntrenamiento', 'duracionEntrenamiento', 'duracionPlanDias');
      break;
  }

  controles.forEach(nombre => {
    this.formularioForm.get(nombre)?.markAsTouched();
  });
}


  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;

      if (this.currentStep === 3 || this.currentStep === 6) {
        setTimeout(() => this.configurarSliders(), 0);
      }
    }
  }

  irAPaso(numero: number): void {
    this.currentStep = numero;
    this.editandoDesdeResumen = true;

    if (this.currentStep === 3 || this.currentStep === 6) {
      setTimeout(() => this.configurarSliders(), 0);
    }
  }

  volverAlResumen(): void {
    this.currentStep = this.totalSteps;
    this.editandoDesdeResumen = false;
    this.cargarResumen();
  }


  esPasoActualValido(): boolean {
  switch (this.currentStep) {
    case 1:
      return !!this.formularioForm.get('peso')?.valid && !!this.formularioForm.get('altura')?.valid;
    case 2:
      return !!this.formularioForm.get('objetivo')?.valid;
    case 3:
      return !!this.formularioForm.get('frecuenciaActividad')?.valid &&
             !!this.formularioForm.get('exigenciaActividad')?.valid;
    case 4:
      return !!this.formularioForm.get('tipoEntrenamiento')?.valid;
    case 5:
      return !!this.formularioForm.get('equipamientoSeleccionado')?.valid;
    case 6:
      return !!this.formularioForm.get('diasEntrenamiento')?.valid &&
             !!this.formularioForm.get('duracionEntrenamiento')?.valid &&
             !!this.formularioForm.get('duracionPlanDias')?.valid;
    default:
      return false;
  }
}


  configurarSliders(): void {
    // Paso 3
    this.configurarSlider(
      'rangoFrecuenciaActividad',
      'actividadFill',
      '#rangoFrecuenciaActividad + .scale-track .scale-point',
      1,
      5
    );
    this.configurarSlider(
      'rangoExigencia',
      'exigenciaFill',
      '#rangoExigencia + .scale-track .scale-point',
      1,
      5
    );

    // Paso 6
    this.configurarSlider(
      'rangoDiasSemanales',
      'diasSemanalesFill',
      '#rangoDiasSemanales + .scale-track .scale-point',
      1,
      5
    );
    this.configurarSlider(
      'rangoMinutos',
      'minutosFill',
      '#rangoMinutos + .scale-track .scale-point',
      1,
      3
    );
    this.configurarSlider(
      'duracionPlan',
      'duracionPlanFill',
      '#duracionPlan + .scale-track .scale-point',
      1,
      3
    );
  }

  configurarSlider(
    inputId: string,
    fillId: string,
    pointSelector: string,
    min: number,
    max: number
  ): void {
    const slider = this.el.nativeElement.querySelector(`#${inputId}`);
    const fill = this.el.nativeElement.querySelector(`#${fillId}`);
    const points = this.el.nativeElement.querySelectorAll(pointSelector);

    if (
      !(slider instanceof HTMLInputElement) ||
      !(fill instanceof HTMLElement) ||
      points.length === 0
    )
      return;

    const updateSliderUI = (value: string) => {
      const percentage = ((+value - min) / (max - min)) * 100;
      fill.style.width = `${percentage}%`;

      points.forEach((point: Element, index: number) => {
        const pointEl = point as HTMLElement;
        const pointValue = min + index;

        if (pointValue === parseInt(value)) {
          pointEl.classList.add('inactive');
          pointEl.classList.remove('active');
        } else if (pointValue < parseInt(value)) {
          pointEl.classList.add('inactive');
          pointEl.classList.remove('active');
        } else {
          pointEl.classList.remove('inactive', 'active');
        }
      });
    };

    updateSliderUI(slider.value);

    slider.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      updateSliderUI(target.value);
    });
  }

  opcionesEntrenamiento = [
  {
    id: 1,
    nombre: 'Cuerpo Completo',
    imagen: 'imagenes/cuerpo-completo.png',
    descripcion: 'Entrenamiento que trabaja todo el cuerpo.'
  },
  {
    id: 2,
    nombre: 'Tren Superior',
    imagen: 'imagenes/tren-superior.png',
    descripcion: 'Enfocado en pecho, espalda, hombros y brazos.'
  },
  {
    id: 3,
    nombre: 'Tren Inferior',
    imagen: 'imagenes/tren-inferior.png',
    descripcion: 'Piernas, glúteos y pantorrillas.'
  },
  {
    id: 4,
    nombre: 'Cardio',
    imagen: 'imagenes/cardio.png',
    descripcion: 'Mejora la resistencia y salud cardiovascular.'
  }
];
opcionesObjetivo = [
  { id: 1, nombre: 'Reducir grasa corporal – Bajar de peso' },
  { id: 2, nombre: 'Tonificar el cuerpo – Mejorar la apariencia muscular' },
  { id: 3, nombre: 'Ganar masa muscular – Aumentar fuerza' },
  { id: 4, nombre: 'Mejorar la flexibilidad y movilidad' },
  { id: 5, nombre: 'Mantenerme activo/a y con energía cada día' },
  { id: 6, nombre: 'Combatir el sedentarismo' },
];


  opcionSeleccionada: string | null = null;
  hoveredCard: string | null = null;

seleccionarCard(nombre: string): void {
  this.opcionSeleccionada = nombre;
  const seleccion = this.opcionesEntrenamiento.find(e => e.nombre === nombre);
  if (seleccion) {
    this.formularioForm.get('tipoEntrenamiento')?.setValue(seleccion.id);
  }
}


  hoverCard(opcion: string): void {
    this.hoveredCard = opcion;
  }

  leaveCard(opcion: string): void {
    if (this.hoveredCard === opcion) {
      this.hoveredCard = null;
    }
  }

 equipamientoOpciones = [
  { id: 1, nombre: 'Colchoneta', imagen: 'imagenes/colchoneta.png' },
  { id: 2, nombre: 'Mancuernas', imagen: 'imagenes/mancuernas.png' },
  { id: 3, nombre: 'Banda Elástica', imagen: 'imagenes/banda-elastica.png' },
  { id: 4, nombre: 'Tobilleras', imagen: 'imagenes/tobilleras.png' },
  { id: 5, nombre: 'Soga', imagen: 'imagenes/soga.png' },
  { id: 6, nombre: 'Ninguno', imagen: 'imagenes/ninguno.png' }
];


  toggleEquipamiento(item: { id: number, nombre: string }) {
  const nombre = item.nombre;

  if (nombre === 'Ninguno') {
    this.equipamientoSeleccionado = ['Ninguno'];
    this.formularioForm.get('equipamientoSeleccionado')?.setValue([item.id]);
  } else {
    if (this.equipamientoSeleccionado.includes(nombre)) {
      this.equipamientoSeleccionado = this.equipamientoSeleccionado.filter(e => e !== nombre);
    } else {
      this.equipamientoSeleccionado.push(nombre);
    }

    this.equipamientoSeleccionado = this.equipamientoSeleccionado.filter(e => e !== 'Ninguno');

    const ids = this.equipamientoOpciones
      .filter(e => this.equipamientoSeleccionado.includes(e.nombre))
      .map(e => e.id);

    this.formularioForm.get('equipamientoSeleccionado')?.setValue(ids);
  }
}


  estaSeleccionado(item: { nombre: string }): boolean {
    return this.equipamientoSeleccionado.includes(item.nombre);
  }

  cargarResumen(): void {
    // Paso 1 - Peso y altura
    const inputsNumber = this.el.nativeElement.querySelectorAll(
      "input[type='number']"
    );
    const peso = inputsNumber[0]?.value || 'No especificado';
    const altura = inputsNumber[1]?.value || 'No especificado';
    this.setTexto('resumenPeso', peso);
    this.setTexto('resumenAltura', altura);

    // Paso 2 - Objetivo
    const objetivo = this.el.nativeElement.querySelector(
      "input[name='objetivo']:checked"
    ) as HTMLInputElement;
    this.setTexto('resumenObjetivo', objetivo?.name || 'No seleccionado');

    // Paso 3 - Actividad y Exigencia
    const actividad = this.getInputValueById('rangoFrecuenciaActividad');
    const exigencia = this.getInputValueById('rangoExigencia');
    this.setTexto('resumenActividad', this.traducirEscalaActividad(actividad));
    this.setTexto('resumenExigencia', this.traducirEscalaExigencia(exigencia));

    // Paso 4 - Tipo de entrenamiento (card seleccionada)
    if (this.opcionSeleccionada) {
      this.setTexto('resumenEntrenamiento', this.opcionSeleccionada);

      const entrenamiento = this.opcionesEntrenamiento.find(
        (e) => e.nombre === this.opcionSeleccionada
      );
      const img = this.el.nativeElement.querySelector(
        '#resumenImagenEntrenamiento'
      ) as HTMLImageElement;
      if (img && entrenamiento) {
        img.src = entrenamiento.imagen;
        img.alt = entrenamiento.nombre;
        img.style.display = 'block';
      }
    } else {
      this.setTexto('resumenEntrenamiento', 'No seleccionado');
      const img = this.el.nativeElement.querySelector(
        '#resumenImagenEntrenamiento'
      ) as HTMLImageElement;
      if (img) img.style.display = 'none';
    }

    // Paso 5 - Equipamiento
    const equipamientoTexto =
      this.equipamientoSeleccionado.length > 0
        ? this.equipamientoSeleccionado.join(', ')
        : 'No seleccionado';
    this.setTexto('resumenEquipamiento', equipamientoTexto);

    const contenedor = this.el.nativeElement.querySelector(
      '#resumenImagenesEquipamiento'
    );
    if (contenedor) {
      contenedor.innerHTML = '';

      if (
        this.equipamientoSeleccionado.length > 0 &&
        !this.equipamientoSeleccionado.includes('Ninguno')
      ) {
        this.equipamientoSeleccionado.forEach((nombre) => {
          const item = this.equipamientoOpciones.find(
            (e) => e.nombre === nombre
          );
          if (item) {
            const img = this.renderer.createElement('img') as HTMLImageElement;
            img.src = item.imagen;
            img.alt = nombre;
            img.title = nombre;
            this.renderer.setStyle(img, 'maxWidth', '80px');
            this.renderer.setStyle(img, 'borderRadius', '8px');
            this.renderer.appendChild(contenedor, img);
          }
        });
      } else {
        contenedor.innerHTML = '<p>No seleccionado</p>';
      }
    }

    // Paso 6 - Sliders
    const dias = this.getInputValueById('rangoDiasSemanales');
    const minutos = this.getInputValueById('rangoMinutos');
    const duracion = this.getInputValueById('duracionPlan');

    this.setTexto('resumenDiasSemanales', this.traducirDias(dias));
    this.setTexto('resumenMinutos', this.traducirMinutos(minutos));
    this.setTexto('resumenDuracionPlan', this.traducirDuracion(duracion));
  }

  private getInputValueById(id: string): string {
    const input = this.el.nativeElement.querySelector(
      `#${id}`
    ) as HTMLInputElement;
    return input?.value || '';
  }

  private setTexto(id: string, value: string): void {
    const el = this.el.nativeElement.querySelector(`#${id}`);
    if (el) el.innerText = value;
  }

  protected traducirObjetivo(valor: string): string {
    const mapa: Record<string, string> = {
      '1': 'Reducir grasa corporal – Bajar de peso',
      '2': 'Tonificar el cuerpo – Mejorar la apariencia muscular',
      '3': 'Ganar masa muscular – Aumentar fuerza',
      '4': 'Mejorar la flexibilidad y movilidad',
      '5': 'Mantenerme activo/a y con energía cada día',
      '6': 'Combatir el sedentarismo',
    };
    return mapa[valor] || 'No especificado';
  }
  protected traducirEscalaActividad(valor: string): string {
    const mapa: Record<string, string> = {
      '1': 'Ninguna',
      '2': 'Muy poca',
      '3': 'Moderada',
      '4': 'Frecuente',
      '5': 'Mucha',
    };
    return mapa[valor] || 'No especificado';
  }


  protected traducirEscalaExigencia(valor: string): string {
    const mapa: Record<string, string> = {
      '1': 'Muy baja',
      '2': 'Baja',
      '3': 'Moderada',
      '4': 'Alta',
      '5': 'Muy alta',
    };
    return mapa[valor] || 'No especificado';
  }
  protected traducirDias(valor: string): string {
    const mapa: Record<string, string> = {
      '1': '1 día',
      '2': '2 días',
      '3': '3 días',
      '4': '4 días',
      '5': '5 días',
    };
    return mapa[valor] || 'No especificado';
  }

  protected traducirMinutos(valor: string): string {
    const mapa: Record<string, string> = {
      '1': '10 a 15 min.',
      '2': '15 a 25 min.',
      '3': '25 a 40 min.',
    };
    return mapa[valor] || 'No especificado';
  }

  protected traducirDuracion(valor: string): string {
    const mapa: Record<string, string> = {
      '1': '15 días',
      '2': '30 días',
      '3': '45 días',
    };
    return mapa[valor] || 'No especificado';
  }

  get imagenEntrenamientoSeleccionado(): string | null {
    const entrenamiento = this.opcionesEntrenamiento.find(
      (e) => e.nombre === this.opcionSeleccionada
    );
    return entrenamiento ? entrenamiento.imagen : null;
  }

  verFormulario() {
    console.log(this.formularioForm);
  }
}
