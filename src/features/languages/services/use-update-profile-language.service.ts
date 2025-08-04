import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '~/features';
import {
  updateProfileLanguage,
  type UpdateProfileLanguageData,
  type UpdateProfileLanguageError,
  type UpdateProfileLanguageParams,
} from '~/shared';

type Params = {} & Omit<
  UseMutationOptions<
    UpdateProfileLanguageData,
    UpdateProfileLanguageError,
    Omit<UpdateProfileLanguageParams, 'accessToken'>
  >,
  'mutationFn'
>;

export function useUpdateProfileLanguage(params: Params = {}) {
  const auth = useAuth();
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const UpdateProfileLanguageResult = await updateProfileLanguage({
        ...params,
        accessToken: auth.accessToken!,
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
