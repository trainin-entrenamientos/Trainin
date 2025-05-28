export function getTokenExpiracion(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch (e) {
    return null;
  }
}

export function tokenExpirado(token: string): boolean {
  const exp = getTokenExpiracion(token);
  return !exp || Date.now() > exp;
}
