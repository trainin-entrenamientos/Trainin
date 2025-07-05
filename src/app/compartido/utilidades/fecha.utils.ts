/**
 * Toma un string con fecha en formato
 * - "dd/MM/yyyy" (p.ej. "22/08/2002") o
 * - cualquier ISO (p.ej. "2025-06-21T00:00:00")
 * y devuelve "yyyy-MM-dd"
 */
export function convertirFechaYYYYMMDD(value: string): string {
  const ddmmyyyy = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const m = value.match(ddmmyyyy);
  if (m) {
    const [, day, month, year] = m;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const isoDate = value.split('T')[0];
  return isoDate;
}
