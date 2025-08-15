import { updateToken } from '~/shared/lib/http';
import { decodeJWT } from '~/shared/utils';

export async function refreshAuth() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken) {
    const updateTokenResult = await updateToken({ refreshToken });

    if (updateTokenResult.ok) {
      const { accessToken, refreshToken } = updateTokenResult.data;
      localStorage.setItem('refreshToken', refreshToken);
      const decoded = decodeJWT(accessToken);
      return { accessToken, userId: String(decoded.payload.sub) };
    }
  }

  return null;
}
