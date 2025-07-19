import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { auth, type AuthData, type AuthError } from '~/shared';
import { LOGIN_QUERY } from '~/features/auth/services/queries';
import type { AuthInput } from 'cv-graphql';

export function useLogin(params: UseMutationOptions<AuthData, AuthError, AuthInput>) {
  const { mutate, ...mutation } = useMutation<AuthData, AuthError, AuthInput>({
    ...params,
    mutationFn: async (params: AuthInput) => {
      const signupResult = await auth(LOGIN_QUERY, 'login', params);

      if (signupResult.ok) {
        return signupResult.data;
      }

      throw signupResult.error;
    },
  });

  return { login: mutate, ...mutation };
}
