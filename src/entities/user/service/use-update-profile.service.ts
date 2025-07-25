import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '~/app';
import {
  updateProfile,
  type UpdateProfileData,
  type UpdateProfileError,
  type UpdateProfileParams,
} from '~/shared/lib/http';

export type UpdateProfileVariables = Omit<UpdateProfileParams, 'accessToken'>;

const useUpdateProfileMutation = (
  options?: UseMutationOptions<UpdateProfileData, UpdateProfileError, UpdateProfileVariables>
) => {
  const auth = useAuth();

  const mutationFn = async (params: UpdateProfileVariables) => {
    if (!auth?.accessToken) {
      throw new Error('Not authenticated');
    }
    const result = await updateProfile({ ...params, accessToken: auth.accessToken });
    if (result.ok) {
      return result.data;
    }
    throw result.error;
  };

  return useMutation<UpdateProfileData, UpdateProfileError, UpdateProfileVariables>({
    mutationFn,
    ...options,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useUpdateProfileMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
