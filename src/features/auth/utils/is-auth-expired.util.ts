import { decodeJWT } from '~/shared';
import type { AuthData } from '../services';

export function isAuthExpired(auth: AuthData) {
  const decoded = decodeJWT(auth.accessToken);
  return decoded.payload.exp < Date.now() / 1000;
}
