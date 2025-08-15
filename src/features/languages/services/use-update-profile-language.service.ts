import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import {
  updateProfileLanguage,
  type UpdateProfileLanguageData,
  type UpdateProfileLanguageError,
  type UpdateProfileLanguageParams,
} from '~/shared/lib/http';

type Params = {} & Omit<
  UseMutationOptions<
    UpdateProfileLanguageData,
    UpdateProfileLanguageError,
    Omit<UpdateProfileLanguageParams, 'accessToken'>
  >,
  'mutationFn'
>;

export function useUpdateProfileLanguage(params: Params = {}) {
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const UpdateProfileLanguageResult = await updateProfileLanguage({
        ...params,
      });

      if (UpdateProfileLanguageResult.ok) {
        const profile = UpdateProfileLanguageResult.data;
        return profile;
      }

      throw UpdateProfileLanguageResult.error;
    },
    ...params,
  });

  return { updateProfileLanguage: mutate, ...mutation };
}
