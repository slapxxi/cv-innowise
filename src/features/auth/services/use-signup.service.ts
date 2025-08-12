import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { signup, type SignupData, type SignupError, type SignupParams } from '~/shared/lib/http';

export function useSignup(params: UseMutationOptions<SignupData, SignupError, SignupParams>) {
  const queryClient = useQueryClient();
  const { mutate, ...mutation } = useMutation<SignupData, SignupError, SignupParams>({
    ...params,
    mutationFn: async (params: SignupParams) => {
      const signupResult = await signup(params);

      if (signupResult.ok) {
        const { user, accessToken, refreshToken } = signupResult.data;
        localStorage.setItem('refreshToken', refreshToken);
        queryClient.setQueryData(['auth'], { user, accessToken });
        return { user, accessToken, refreshToken };
      }

      throw signupResult.error;
    },
  });

  return { signup: mutate, ...mutation };
}
