import { decodeJWT, type AuthData } from '~/shared';

export function isAuthExpired(auth: AuthData) {
  const decoded = decodeJWT(auth.accessToken);
  return decoded.payload.exp < Date.now() / 1000;
}
