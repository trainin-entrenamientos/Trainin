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
