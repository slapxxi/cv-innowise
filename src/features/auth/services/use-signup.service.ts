import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { signup, type SignupData, type SignupError, type SignupParams } from '~/shared';

export function useSignup(params: UseMutationOptions<SignupData, SignupError, SignupParams>) {
  const queryClient = useQueryClient();
  const { mutate, ...mutation } = useMutation<SignupData, SignupError, SignupParams>({
    ...params,
    mutationFn: async (params: SignupParams) => {
      const signupResult = await signup(params);

      if (signupResult.ok) {
        sessionStorage.setItem('access_token', signupResult.data.access_token);
        queryClient.setQueryData(['auth', 'user'], signupResult.data.user);
        return signupResult.data;
      }

      throw signupResult.error;
    },
  });

  return { signup: mutate, ...mutation };
}
