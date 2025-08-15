import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import {
  createProfileLanguage,
  type CreateProfileLanguageData,
  type CreateProfileLanguageError,
  type CreateProfileLanguageParams,
} from '~/shared/lib/http';

type Params = {} & Omit<
  UseMutationOptions<
    CreateProfileLanguageData,
    CreateProfileLanguageError,
    Omit<CreateProfileLanguageParams, 'accessToken'>
  >,
  'mutationFn'
>;

export function useCreateProfileLanguage(params: Params = {}) {
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const createProfileLanguageResult = await createProfileLanguage({
        ...params,
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
