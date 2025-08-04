import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '~/features';
import {
  createProfileLanguage,
  type CreateProfileLanguageData,
  type CreateProfileLanguageError,
  type CreateProfileLanguageParams,
} from '~/shared';

type Params = {} & Omit<
  UseMutationOptions<
    CreateProfileLanguageData,
    CreateProfileLanguageError,
    Omit<CreateProfileLanguageParams, 'accessToken'>
  >,
  'mutationFn'
>;

export function useCreateProfileLanguage(params: Params = {}) {
  const auth = useAuth();
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const createProfileLanguageResult = await createProfileLanguage({
        ...params,
        accessToken: auth.accessToken!,
      });

      if (createProfileLanguageResult.ok) {
        const profile = createProfileLanguageResult.data;
        return profile;
      }

      throw createProfileLanguageResult.error;
    },
    ...params,
  });

  return { createProfileLanguage: mutate, ...mutation };
}
