import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { login, type LoginData, type UpdateTokenError, type LoginParams } from '~/shared';

export function useLogin(params: UseMutationOptions<LoginData, UpdateTokenError, LoginParams>) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, ...mutation } = useMutation<LoginData, UpdateTokenError, LoginParams>({
    ...params,
    mutationFn: async (params: LoginParams) => {
      const loginResult = await login(params);

      if (loginResult.ok) {
        const { accessToken, refreshToken, user } = loginResult.data;
        localStorage.setItem('refreshToken', refreshToken);
        queryClient.setQueryData(['auth'], { accessToken, userId: user.id });
        queryClient.setQueryData(['user', user.id], user);
        router.invalidate();
        return { accessToken, refreshToken, user };
      }

      throw loginResult.error;
    },
  });

  return { login: mutate, ...mutation };
}
