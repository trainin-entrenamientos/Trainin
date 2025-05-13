import { Component } from '@angular/core';

@Component({
  selector: 'app-formulario-crear-plan-de-entrenamiento',
  standalone: false,
  templateUrl: './formulario-crear-plan-de-entrenamiento.component.html',
  styleUrl: './formulario-crear-plan-de-entrenamiento.component.css'
})
export class FormularioCrearPlanDeEntrenamientoComponent {

}


-----
<!--SCRIPT DE LOS PASOS A REALIZAR-->
			<script>
				let currentStep = 1;
				const totalSteps = 7;
				
				function showStep(step) {
				    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
				    const target = document.querySelector('.step-' + step);
				    if (target) target.classList.add('active');
				}

				function nextStep() {
				
				const currentStepEl = document.querySelector(`.step-${currentStep}`);
				
				
				if (currentStep < totalSteps) {
				currentStep++;
				showStep(currentStep);
				
				if (currentStep === totalSteps) {
				    cargarResumen();
				}
				}
				}
				
				function previousStep() {
				    if (currentStep > 1) {
				        currentStep--;
				        showStep(currentStep);
				    }
				}

				function irAPaso(numero) {
					// Ocultar todos los pasos
					document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
					// Mostrar el paso deseado
					const pasoActual = document.querySelector(".step-" + numero);
					pasoActual.classList.add("active");

					// Ocultar todos los botones "Volver al resumen"
					document.querySelectorAll(".volver-al-resumen").forEach(b => b.style.display = "none");

					// Ocultar todos los botones Siguiente/Anterior por si vienen de resumen
					document.querySelectorAll(".btn-anterior, .btn-siguiente").forEach(btn => {
						btn.style.display = "flex"; // restaurar por defecto
					});

					// Si no estamos en el resumen, mostrar botón volver al resumen
					if (numero !== 7) {
						const volver = pasoActual.querySelector(".volver-al-resumen");
						if (volver) volver.style.display = "block";

						// Ocultar botones de navegación normal
						const anterior = pasoActual.querySelector(".btn-anterior");
						const siguiente = pasoActual.querySelector(".btn-siguiente");
						if (anterior) anterior.style.display = "none";
						if (siguiente) siguiente.style.display = "none";
					}
					}

					function volverAlResumen() {
						showStep(7); // Muestra el paso de resumen
						cargarResumen(); // Vuelve a cargar los datos con los nuevos valores
					}

			</script>


			<!--SCRIPT QUE TE PONE EL RESUMEN DE LAS OPCIONES SELECCIONADAS-->
			<script>
				function cargarResumen() {

				/*Info del Paso 1*/
				document.getElementById("resumenPeso").innerText = document.querySelector("input[type='number']").value;
				document.getElementById("resumenAltura").innerText = document.querySelectorAll("input[type='number']")[1].value;
				

				/*Info del Paso 2*/
				const objetivo = document.querySelector("input[name='objetivo']:checked");
				document.getElementById("resumenObjetivo").innerText = objetivo ? objetivo.value : "No seleccionado";


				/*Info del Paso 3*/
				const actividad = document.getElementById("rangoFrecuenciaActividad").value;
				const exigencia = document.getElementById("rangoExigencia").value;
				document.getElementById("resumenActividad").innerText = traducirEscalaActividad(actividad);
				document.getElementById("resumenExigencia").innerText = traducirEscalaExigencia(exigencia);
				

				/*Info del Paso 4*/
				const entrenamiento = document.querySelector('input[name="tipoEntrenamiento"]:checked');

				if (entrenamiento) {
				const label = entrenamiento.closest('label');
				const img = label.querySelector('img');

				document.getElementById("resumenEntrenamiento").innerText = entrenamiento.value;

				const resumenImg = document.getElementById("resumenImagenEntrenamiento");
				resumenImg.src = img.src;
				resumenImg.alt = entrenamiento.value;
				resumenImg.style.display = "block";
				} else {
				document.getElementById("resumenEntrenamiento").innerText = "No seleccionado";
				document.getElementById("resumenImagenEntrenamiento").style.display = "none";
				}
				

				/*Info del Paso 5*/
					const equipamiento = document.getElementById("equipamientoSeleccionado").value;
					document.getElementById("resumenEquipamiento").innerText = equipamiento || "No seleccionado";

					const contenedorImg = document.getElementById("resumenImagenesEquipamiento");
					contenedorImg.innerHTML = ""; // Limpiar contenido anterior

					if (equipamiento && equipamiento !== "Ninguno") {
						const itemsSeleccionados = equipamiento.split(",");
						itemsSeleccionados.forEach(nombre => {
							const item = document.querySelector(`.equipamiento-item[data-value='${nombre}']`);
							if (item) {
								const img = item.querySelector("img");
								const nuevaImg = document.createElement("img");
								nuevaImg.src = img.src;
								nuevaImg.alt = nombre;
								nuevaImg.title = nombre;
								nuevaImg.style.maxWidth = "80px";
								nuevaImg.style.borderRadius = "8px";
								contenedorImg.appendChild(nuevaImg);
							}
						});
					} else {
						contenedorImg.innerHTML = "<p>No seleccionado</p>";
					}

				
				/*Info del Paso 6*/
				const diasSemanales = document.getElementById("rangoDiasSemanales").value;
				const minutos = document.getElementById("rangoMinutos").value;
				const duracion = document.getElementById("duracionPlan").value;

				document.getElementById("resumenDiasSemanales").innerText = traducirDias(diasSemanales);
				document.getElementById("resumenMinutos").innerText = traducirMinutos(minutos);
				document.getElementById("resumenDuracionPlan").innerText = traducirDuracion(duracion);}
				
				function traducirEscalaActividad(valor) {
				const mapa = {
				    "1": "Ninguna",
				    "2": "Muy poca",
				    "3": "Moderada",
				    "4": "Frecuente",
				    "5": "Mucha"
				};
				return mapa[valor] || "Ninguna"; /*ESTO NOSE SI ESTA BIEN O MAL A NIVEL LÓGICA*/
				}

				function traducirEscalaExigencia(valor) {
				const mapa = {
				    "1": "Muy baja",
				    "2": "Baja",
				    "3": "Moderada",
				    "4": "Alta",
				    "5": "Muy alta"
				};
				return mapa[valor] || "Muy Baja";  /*ESTO NOSE SI ESTA BIEN O MAL A NIVEL LÓGICA*/
				}
				
				function traducirDias(valor) {
							const mapa = {
								"1": "1 día",
								"2": "2 días",
								"3": "3 días",
								"4": "4 días",
								"5": "5 días"
							};
							return mapa[valor] || "No especificado";
						}

						function traducirMinutos(valor) {
							const mapa = {
								"1": "10 a 15 min.",
								"2": "15 a 25 min.",
								"3": "25 a 40 min."
							};
							return mapa[valor] || "No especificado";
						}

						function traducirDuracion(valor) {
							const mapa = {
								"1": "15 días",
								"2": "30 días",
								"3": "45 días"
							};
							return mapa[valor] || "No especificado";
						}
			</script>



			<!--SCRIPT DE LOS SLIDER VERDES CON PUNTOS-->
			<script>
				function configurarSlider(inputId, fillId, pointSelector, min, max) {
				    const slider = document.getElementById(inputId);
				    const fill = document.getElementById(fillId);
				    const points = document.querySelectorAll(pointSelector);
				
				    function updateSliderUI(value) {
				        const percentage = ((value - min) / (max - min)) * 100;
				        fill.style.width = `${percentage}%`;
				
				        points.forEach((point, index) => {
				            const pointValue = min + index;
				            if (pointValue === parseInt(value)) {
				                point.classList.add("inactive");
				                point.classList.remove("active");
				            } else if (pointValue < parseInt(value)) {
				                point.classList.add("inactive");
				                point.classList.remove("active");
				            } else {
				                point.classList.remove("inactive", "active");
				            }
				        });
				    }
				
				    updateSliderUI(slider.value);
				
				    slider.addEventListener("input", (e) => {
				        updateSliderUI(e.target.value);
				    });
				}
				
				// Sliders con valores del 1 al 5
				configurarSlider("rangoFrecuenciaActividad", "actividadFill", "#rangoFrecuenciaActividad + .scale-track .scale-point", 1, 5);
				configurarSlider("rangoExigencia", "exigenciaFill", "#rangoExigencia + .scale-track .scale-point", 1, 5);
				configurarSlider("rangoDiasSemanales", "diasSemanalesFill", "#rangoDiasSemanales + .scale-track .scale-point", 1, 5);
				
				// Sliders con valores del 1 al 3
				configurarSlider("rangoMinutos", "minutosFill", "#rangoMinutos + .scale-track .scale-point", 1, 3);
				configurarSlider("duracionPlan", "duracionPlanFill", "#duracionPlan + .scale-track .scale-point", 1, 3);
				</script>
			
			
			<!--SCRIPT DE LAS CARDS CON LOS TIPOS DE ENTRENAMIENTO-->
			<script>
				function selectCard(clickedCard) {
				// Deseleccionar todas
				document.querySelectorAll('.flip-card').forEach(card => {
				card.classList.remove('selected');
				card.querySelector('input').checked = false;
				});
				
				// Seleccionar la actual
				clickedCard.classList.add('selected');
				clickedCard.querySelector('input').checked = true;
				}
			</script>

			<!--SCRIPT CON LOS EQUIPAMENTOS SELECCIONADOS-->
			<script>
				document.addEventListener("DOMContentLoaded", function () {
				  const items = document.querySelectorAll('.equipamiento-item');
				  const inputSeleccionado = document.getElementById('equipamientoSeleccionado');
				  const ninguno = document.getElementById('ninguno');
				
				  items.forEach(item => {
				    item.addEventListener('click', () => {
				      const valor = item.getAttribute('data-value');
				
				      if (valor === "Ninguno") {
				        // Desmarcar todos menos "Ninguno"
				        items.forEach(i => i.classList.remove('selected'));
				        item.classList.add('selected');
				        inputSeleccionado.value = "Ninguno";
				      } else {
				        // Desmarcar "Ninguno" si estaba marcado
				        ninguno.classList.remove('selected');
				
				        item.classList.toggle('selected');
				
				        // Obtener todos los valores seleccionados
				        const seleccionados = [...document.querySelectorAll('.equipamiento-item.selected')]
				          .map(el => el.getAttribute('data-value'));
				
				        inputSeleccionado.value = seleccionados.join(',');
				      }
				    document.getElementById("resumenEquipamiento").innerText = inputSeleccionado.value || "No seleccionado";
				    });
				  });
				
				});
			</script>