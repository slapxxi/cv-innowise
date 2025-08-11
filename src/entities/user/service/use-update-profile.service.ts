import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import {
  updateProfile,
  useAuth,
  type UpdateProfileData,
  type UpdateProfileError,
  type UpdateProfileParams,
} from '~/shared';

export type UpdateProfileVariables = Omit<UpdateProfileParams, 'accessToken'>;

const useUpdateProfileMutation = (
  options?: UseMutationOptions<UpdateProfileData, UpdateProfileError, UpdateProfileVariables>
) => {
  const auth = useAuth();

  const mutationFn = async (params: UpdateProfileVariables) => {
    if (!auth.accessToken) {
      throw new Error('Not authenticated');
    }
    const result = await updateProfile({ ...params });
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
    },
  });
};
