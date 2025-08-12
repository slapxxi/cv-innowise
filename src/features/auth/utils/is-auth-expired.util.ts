import type { AuthData } from '~/shared/types';
import { decodeJWT } from '~/shared/utils';

export function isAuthExpired(auth: AuthData) {
  const decoded = decodeJWT(auth.accessToken);
  return decoded.payload.exp < Date.now() / 1000;
}
