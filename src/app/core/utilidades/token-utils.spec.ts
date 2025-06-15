import { getTokenExpiracion, tokenExpirado } from './token-utils';

describe('token-utils', () => {
  function makeToken(payload: any) {
    const h = btoa(JSON.stringify({ alg: 'none' }));
    const b = btoa(JSON.stringify(payload));
    return `${h}.${b}.`;
  }

  it('Debería retornar en milisegundos la fecha de expiración del token', () => {
    const nowSec = Math.floor(Date.now()/1000);
    const token = makeToken({ exp: nowSec + 10 });
    expect(getTokenExpiracion(token)).toBe((nowSec + 10) * 1000);
  });

  it('Debería devolver null si el token no tiene fecha de expiración o es inválido', () => {
    expect(getTokenExpiracion('no.un.jwt')).toBeNull();
    const tokenSinExp = makeToken({ foo: 'bar' });
    expect(getTokenExpiracion(tokenSinExp)).toBeNull();
  });

  it('Debería indicar expirado cuando la fecha de expiración ya pasó', () => {
    const past = Math.floor(Date.now()/1000) - 1;
    const token = makeToken({ exp: past });
    expect(tokenExpirado(token)).toBeTrue();
  });

  it('Debería indicar que el token no expiró', () => {
    const future = Math.floor(Date.now()/1000) + 60;
    const token = makeToken({ exp: future });
    expect(tokenExpirado(token)).toBeFalse();
  });

  it('Debería considerarse expirado un token inválido', () => {
    expect(tokenExpirado('invalido')).toBeTrue();
  });
});