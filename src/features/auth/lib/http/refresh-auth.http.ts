import { updateToken, decodeJWT, getUser } from '~/shared';

export async function refreshAuth() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken) {
    const updateTokenResult = await updateToken({ refreshToken });

    if (updateTokenResult.ok) {
      const { accessToken, refreshToken } = updateTokenResult.data;
      localStorage.setItem('refreshToken', refreshToken);
      const decoded = decodeJWT(accessToken);
      const userResult = await getUser({ id: decoded.payload.sub, accessToken });

      if (userResult.ok) {
        return { accessToken, user: userResult.data };
      }
    }
  }

  return null;
}
