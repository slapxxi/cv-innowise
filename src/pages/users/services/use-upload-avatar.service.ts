import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { uploadAvatar, type UploadAvatarResult } from '~/shared/lib/http';
import type { UploadAvatarInput } from '~/shared/types';

export const useUploadAvatar = (options?: UseMutationOptions<UploadAvatarResult, unknown, UploadAvatarInput>) => {
  const queryClient = useQueryClient();

  return useMutation<UploadAvatarResult, unknown, UploadAvatarInput>({
    mutationFn: (avatar) => {
      return uploadAvatar({ ...avatar });
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
