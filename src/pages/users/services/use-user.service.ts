import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '~/shared/hooks';
import { getUser, type GetUserData, type GetUserError } from '~/shared/lib/http';

type QueryOptions = UseSuspenseQueryOptions<GetUserData, GetUserError>;

type Params = { id: string } & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export const userOptions = (params: { id: string; accessToken: string }) => {
  const { id, accessToken } = params;
  return {
    queryKey: ['user', id],
    queryFn: async () => {
      const userResult = await getUser({ id, accessToken });

      if (userResult.ok) {
        return userResult.data;
      }

      throw userResult.error;
    },
  };
};

export function useUser(params: Params) {
  const { id, ...restParams } = params;
  const queryClient = useQueryClient();
  const auth = useAuth();
  const { data, ...rest } = useSuspenseQuery({
    ...userOptions({ id, accessToken: auth.accessToken! }),
    ...restParams,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['user', id] });
  }

  return { user: data, invalidateUser: invalidate, ...rest };
}
