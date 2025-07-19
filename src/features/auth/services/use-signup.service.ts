import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { auth, type AuthData, type AuthError } from '~/shared';
import { SIGNUP_QUERY } from '~/features/auth/services/queries';
import type { AuthInput } from 'cv-graphql';

export function useSignup(params: UseMutationOptions<AuthData, AuthError, AuthInput>) {
  const { mutate, ...mutation } = useMutation<AuthData, AuthError, AuthInput>({
    ...params,
    mutationFn: async (params: AuthInput) => {
      const signupResult = await auth(SIGNUP_QUERY, 'signup', params);

      if (signupResult.ok) {
        return signupResult.data;
      }

      throw signupResult.error;
    },
  });

  return { signup: mutate, ...mutation };
}
