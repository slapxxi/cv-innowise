import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { login, type LoginData, type LoginError, type LoginParams } from '~/shared';

export function useLogin(params: UseMutationOptions<LoginData, LoginError, LoginParams>) {
  const queryClient = useQueryClient();
  const { mutate, ...mutation } = useMutation<LoginData, LoginError, LoginParams>({
    ...params,
    mutationFn: async (params: LoginParams) => {
      const loginResult = await login(params);

      if (loginResult.ok) {
        sessionStorage.setItem('access_token', loginResult.data.access_token);
        queryClient.setQueryData(['auth', 'user'], loginResult.data.user);
        return loginResult.data;
      }

      throw loginResult.error;
    },
  });

  return { login: mutate, ...mutation };
}
