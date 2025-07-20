import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { signup, type SignupData, type SignupError, type SignupParams } from '~/shared';
import type { AuthInput } from 'cv-graphql';

export function useSignup(params: UseMutationOptions<SignupData, SignupError, SignupParams>) {
  const { mutate, ...mutation } = useMutation<SignupData, SignupError, SignupParams>({
    ...params,
    mutationFn: async (params: AuthInput) => {
      const signupResult = await signup(params);

      if (signupResult.ok) {
        return signupResult.data;
      }

      throw signupResult.error;
    },
  });

  return { signup: mutate, ...mutation };
}
