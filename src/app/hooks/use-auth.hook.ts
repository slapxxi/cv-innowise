import { useQuery } from '@tanstack/react-query';
import { router } from '~/main';
import { decodeJWT, getUser, queryClient, updateToken, type Auth } from '~/shared';

export type AuthData = {
  accessToken: string;
  userId: string;
};

export function useAuth(): Auth {
  const auth = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        const updateTokenResult = await updateToken({ refreshToken });

        if (updateTokenResult.ok) {
          const { accessToken, refreshToken } = updateTokenResult.data;
          localStorage.setItem('refreshToken', refreshToken);
          const decoded = decodeJWT(accessToken);
          return { accessToken, userId: String(decoded.payload.sub) };
        }

        throw updateTokenResult.error;
      }

      return null;
    },
  });

  const user = useQuery({
    queryKey: ['user', auth.data?.userId],
    queryFn: async () => {
      const userResult = await getUser({ id: auth.data!.userId, accessToken: auth.data!.accessToken });

      if (userResult.ok) {
        return userResult.data;
      }

      throw userResult.error;
    },
    enabled: !!auth.data,
  });

  return {
    accessToken: auth.data?.accessToken ?? null,
    user: user.data ?? null,
    isLoading: auth.isLoading || user.isLoading,
    isFetching: auth.isFetching || user.isFetching,
    isAuthenticated: () => !!queryClient.getQueryData(['auth']),
    logout: () => {
      localStorage.removeItem('refreshToken');
      queryClient.removeQueries({ queryKey: ['auth'] });
      router.invalidate();
    },
  };
}
