import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import type { UploadAvatarInput } from 'cv-graphql';
import { useAuth } from '~/features';

import { uploadAvatar, type UploadAvatarResult } from '~/shared';

export const useUploadAvatar = (options?: UseMutationOptions<UploadAvatarResult, unknown, UploadAvatarInput>) => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation<UploadAvatarResult, unknown, UploadAvatarInput>({
    mutationFn: (avatar) => {
      return uploadAvatar({ ...avatar, accessToken: auth.accessToken! });
    },
    ...options,
    onSuccess: (data, variables, context) => {
      if (data.ok) {
        queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      }
      options?.onSuccess?.(data, variables, context);
    },
  });
};
