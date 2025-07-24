import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '~/app';
import { getUsers, type GetUsersData, type GetUsersError } from '~/shared';

type QueryOptions = UseSuspenseQueryOptions<GetUsersData, GetUsersError>;

export const usersOptions = (params: { accessToken: string }) => {
  const { accessToken } = params;
  return {
    queryKey: ['users'],
    queryFn: async () => {
      const userResult = await getUsers({ accessToken });

      if (userResult.ok) {
        return userResult.data;
      }

      throw userResult.error;
    },
  };
};

type Params = {} & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function useUsers(params: Params = {}) {
  const { ...restParams } = params;
  const queryClient = useQueryClient();
  const auth = useAuth();
  const { data, ...rest } = useSuspenseQuery({
    ...usersOptions({ accessToken: auth!.accessToken }),
    ...restParams,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  }

  return { users: data, invalidateUsers: invalidate, ...rest };
}
