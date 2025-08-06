import { useQuery } from '@tanstack/react-query';
import { queryClient, type Auth, type User } from '~/shared';
import { refreshAuth } from '../lib/http';
import { isAuthExpired } from '../utils';

export type AuthData = {
  accessToken: string;
  user: User;
};

const queryKey = ['auth'];

async function queryFn() {
  const auth = queryClient.getQueryData(queryKey) as AuthData | undefined;

  if (auth) {
    if (isAuthExpired(auth)) {
      return refreshAuth();
    }

    return auth;
  }

  return refreshAuth();
}

export const authOptions = () => {
  return {
    queryKey,
    queryFn,
  };
};

export function useAuth(): Auth {
  const { data, isLoading, isFetching } = useQuery<AuthData | null>(authOptions());

  return {
    accessToken: data?.accessToken ?? null,
    user: data?.user ?? null,
    isLoading,
    isFetching,
    isAuthenticated: !!data?.user,
  };
}
