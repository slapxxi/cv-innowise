import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '~/shared/hooks';
import { updateUser, type UpdateUserData, type UpdateUserError, type UpdateUserParams } from '~/shared/lib/http';

const useUpdateUserMutation = (options?: UseMutationOptions<UpdateUserData, UpdateUserError, UpdateUserParams>) => {
  const auth = useAuth();

  const mutationFn = async (params: UpdateUserParams) => {
    if (!auth?.accessToken) {
      throw new Error('Not authenticated');
    }
    const result = await updateUser({ ...params });
    if (result.ok) {
      return result.data;
    }
    throw result.error;
  };

  return useMutation<UpdateUserData, UpdateUserError, UpdateUserParams>({
    mutationFn,
    ...options,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useUpdateUserMutation({
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
