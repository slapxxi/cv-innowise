import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { signup, type SignupData, type SignupError, type SignupParams } from '~/shared';

export function useSignup(params: UseMutationOptions<SignupData, SignupError, SignupParams>) {
  const { mutate, ...mutation } = useMutation<SignupData, SignupError, SignupParams>({
    ...params,
    mutationFn: async (params: SignupParams) => {
      const signupResult = await signup(params);

      if (signupResult.ok) {
        return signupResult.data;
      }

      throw signupResult.error;
    },
  });

  return { signup: mutate, ...mutation };
}
