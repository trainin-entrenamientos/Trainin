import { convertirFechaYYYYMMDD } from "./fecha.utils";

describe('convertirFechaYYYYMMDD', () => {
  it('debería convertir una fecha en formato "dd/MM/yyyy" a "yyyy-MM-dd"', () => {
    const result = convertirFechaYYYYMMDD('22/08/2002');
    expect(result).toBe('2002-08-22');
  });

  it('debería devolver la fecha ISO en formato "yyyy-MM-dd" cuando se pasa una fecha ISO', () => {
    const result = convertirFechaYYYYMMDD('2025-06-21T00:00:00');
    expect(result).toBe('2025-06-21');
  });

  it('debería devolver una fecha vacía o no válida si el formato no es reconocido', () => {
    const result = convertirFechaYYYYMMDD('2025-06-21');
    expect(result).toBe('2025-06-21');
  });

  it('debería manejar fechas en formato ISO sin hora y devolver solo "yyyy-MM-dd"', () => {
    const result = convertirFechaYYYYMMDD('2025-06-21');
    expect(result).toBe('2025-06-21');
  });

  it('debería retornar undefined o un valor predeterminado para un formato de fecha no reconocido', () => {
    const result = convertirFechaYYYYMMDD('invalid-date');
    expect(result).toBe('invalid-date');
  });
});