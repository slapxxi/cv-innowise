import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '~/app';
import { getUser, type LoginData, type LoginParams, type UpdateTokenError } from '~/shared';

type Params = { id: string } & Omit<UseQueryOptions<LoginData, UpdateTokenError, LoginParams>, 'queryKey' | 'queryFn'>;

export function useUser(params: Params) {
  const auth = useAuth();
  const userQuery = useQuery({
    queryKey: ['user', params.id],
    queryFn: async () => {
      const userResult = await getUser({ id: params.id, accessToken: auth!.accessToken });

      if (userResult.ok) {
        return userResult.data;
      }

      throw userResult.error;
    },
  });

  return userQuery;
}
