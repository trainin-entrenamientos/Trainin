import { CorreccionDataService } from './correccion-data.service';
import { DatosEjercicio } from '../../../compartido/interfaces/datos-ejercicio-correccion';

describe('CorreccionDataService', () => {
  const STORAGE_KEY = 'datosCorreccionMap';
  let service: CorreccionDataService;

  beforeEach(() => {
    sessionStorage.clear();
    service = new CorreccionDataService();
  });

  it('Debería inicializar una lista vacía de ejercicios si no hay datos en sessionStorage', () => {
    expect(service.obtenerTodos()).toEqual([]);
  });

  it('Debería cargar los datos del ejercicio desde sessionStorage si hay un JSON válido al crear el servicio', () => {
    const datos: DatosEjercicio[] = [
      { nombre: 'ej1', maxPorcentaje: 10, reintentos: 1 },
      { nombre: 'ej2', maxPorcentaje: 20, reintentos: 2 },
    ];
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(datos));

    service = new CorreccionDataService();
    expect(service.obtenerTodos()).toEqual(datos);
  });

  it('Debería eliminar los datos si en JSON en sessionStorage es inválido al crear el servicio', () => {
    sessionStorage.setItem(STORAGE_KEY, 'no-es-json');
    service = new CorreccionDataService();

    expect(service.obtenerTodos()).toEqual([]);
  });

  it('Debería registrar un nuevo ejercicio y persistirlo en sessionStorage', () => {
    service.registrarResultado('ej1', 50, 1);

    const almacenado: DatosEjercicio[] = JSON.parse(
      sessionStorage.getItem(STORAGE_KEY)!
    );
    expect(almacenado).toEqual([
      { nombre: 'ej1', maxPorcentaje: 50, reintentos: 1 },
    ]);
    expect(service.obtenerPorEjercicio('ej1')).toEqual({
      nombre: 'ej1',
      maxPorcentaje: 50,
      reintentos: 1,
    });
  });

  it('Debería actualizar los reintentos y no cambiar el porcentaje máximo si el nuevo porcentaje es menor', () => {
    const inicial: DatosEjercicio[] = [
      { nombre: 'ej1', maxPorcentaje: 80, reintentos: 1 },
    ];
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inicial));
    service = new CorreccionDataService();

    service.registrarResultado('ej1', 70, 2);
    const resultado = service.obtenerPorEjercicio('ej1')!;
    expect(resultado.maxPorcentaje).toBe(80);
    expect(resultado.reintentos).toBe(2);
  });

  it('Debería actualizar el máximo porcentaje si el nuevo porcentaje es mayor', () => {
    const inicial: DatosEjercicio[] = [
      { nombre: 'ej1', maxPorcentaje: 80, reintentos: 1 },
    ];
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inicial));
    service = new CorreccionDataService();

    service.registrarResultado('ej1', 90, 2);
    const resultado = service.obtenerPorEjercicio('ej1')!;
    expect(resultado.maxPorcentaje).toBe(90);
    expect(resultado.reintentos).toBe(2);
  });

  it('Debería devolver todos los datos de los ejercicios', () => {
    service.registrarResultado('ej1', 50, 1);
    service.registrarResultado('ej2', 60, 2);

    const todos = service.obtenerTodos();
    expect(todos.length).toBe(2);
    expect(todos).toContain(jasmine.objectContaining({ nombre: 'ej1' }));
    expect(todos).toContain(jasmine.objectContaining({ nombre: 'ej2' }));
  });

  it('Debería limpiar los datos del caché y borrar la clave en sessionStorage', () => {
    service.registrarResultado('ej1', 50, 1);

    service.limpiarDatos();
    expect(service.obtenerTodos()).toEqual([]);
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('Debería devolver undefined si no existe el ejercicio', () => {
    expect(service.obtenerPorEjercicio('inexistente')).toBeUndefined();
  });
});