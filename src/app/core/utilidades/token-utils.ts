export const TokenUtils = {
  getTokenExpiracion(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch (e) {
      return null;
    }
  },

  tokenExpirado(token: string): boolean {
    const exp = this.getTokenExpiracion(token);
    return !exp || Date.now() > exp;
  }
};
