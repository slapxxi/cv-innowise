import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { login, type LoginData, type UpdateTokenError, type LoginParams } from '~/shared';

export function useLogin(params: UseMutationOptions<LoginData, UpdateTokenError, LoginParams>) {
  const queryClient = useQueryClient();
  const { mutate, ...mutation } = useMutation<LoginData, UpdateTokenError, LoginParams>({
    ...params,
    mutationFn: async (params: LoginParams) => {
      const loginResult = await login(params);

      if (loginResult.ok) {
        const { accessToken, refreshToken, user } = loginResult.data;
        localStorage.setItem('refreshToken', refreshToken);
        queryClient.setQueryData(['auth'], { accessToken, user });
        return { accessToken, refreshToken, user };
      }

      throw loginResult.error;
    },
  });

  return { login: mutate, ...mutation };
}
