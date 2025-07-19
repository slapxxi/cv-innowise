import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { login, type LoginData, type LoginError, type LoginParams } from '~/shared';

export function useLogin(params: UseMutationOptions<LoginData, LoginError, LoginParams>) {
  const { mutate, ...mutation } = useMutation<LoginData, LoginError, LoginParams>({
    ...params,
    mutationFn: async (params: LoginParams) => {
      const loginResult = await login(params);

      if (loginResult.ok) {
        return loginResult.data;
      }

      throw loginResult.error;
    },
  });

  return { Login: mutate, ...mutation };
}
