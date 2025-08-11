import { decodeJWT } from '../decode-jwt.util';

describe('decodeJWT', () => {
  function createJWT(header: object, payload: object, signature = 'signature') {
    const encode = (obj: object) =>
      Buffer.from(JSON.stringify(obj)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return `${encode(header)}.${encode(payload)}.${signature}`;
  }

  it('decodes a valid JWT correctly', () => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { sub: '1234567890', name: 'John Doe', admin: true };
    const token = createJWT(header, payload);

    const result = decodeJWT(token);

    expect(result.header).toEqual(header);
    expect(result.payload).toEqual(payload);
    expect(result.signature).toBe('signature');
  });

  it('throws an error on malformed token (less than 3 parts)', () => {
    expect(() => decodeJWT('invalid.token')).toThrow();
  });

  it('throws an error on malformed token (more than 3 parts)', () => {
    expect(() => decodeJWT('a.b.c.d')).toThrow();
  });

  it('throws an error if payload is not valid base64', () => {
    const badToken = 'invalid@@@.bad@@@.sig';
    expect(() => decodeJWT(badToken)).toThrow();
  });

  it('throws an error if base64 decodes but JSON is invalid', () => {
    const badBase64 = Buffer.from('notjson')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const token = `${badBase64}.${badBase64}.sig`;
    expect(() => decodeJWT(token)).toThrow();
  });
});
