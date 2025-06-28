import { TokenUtils } from './token-utils';

describe('TokenUtils', () => {
  const validToken = 'header.' + btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 10000 })) + '.signature'; // Token válido con fecha de expiración en el futuro
  const expiredToken = 'header.' + btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 10000 })) + '.signature'; // Token expirado con fecha de expiración en el pasado
  const invalidToken = 'invalid.token'; // Token inválido (no base64)

  describe('getTokenExpiracion', () => {
    it('debe retornar la fecha de expiración en milisegundos para un token válido', () => {
      const expiration = TokenUtils.getTokenExpiracion(validToken);
      expect(expiration).toBeGreaterThan(Date.now());
    });

    it('debe retornar null para un token inválido', () => {
      const expiration = TokenUtils.getTokenExpiracion(invalidToken);
      expect(expiration).toBeNull();
    });

    it('debe retornar null si el token no tiene la propiedad "exp"', () => {
      const tokenWithoutExp = 'header.' + btoa(JSON.stringify({})) + '.signature'; // Token sin "exp"
      const expiration = TokenUtils.getTokenExpiracion(tokenWithoutExp);
      expect(expiration).toBeNull();
    });
  });

  describe('tokenExpirado', () => {
    it('debe retornar false para un token que no ha expirado', () => {
      const isExpired = TokenUtils.tokenExpirado(validToken);
      expect(isExpired).toBeFalse();
    });

    it('debe retornar true para un token que ya ha expirado', () => {
      const isExpired = TokenUtils.tokenExpirado(expiredToken);
      expect(isExpired).toBeTrue();
    });

    it('debe retornar true para un token inválido', () => {
      const isExpired = TokenUtils.tokenExpirado(invalidToken);
      expect(isExpired).toBeTrue();
    });
  });
});
