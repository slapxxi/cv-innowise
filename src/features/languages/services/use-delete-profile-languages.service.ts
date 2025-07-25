import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '~/app';
import {
  deleteProfileLanguages,
  type DeleteProfileLanguagesData,
  type DeleteProfileLanguagesError,
  type DeleteProfileLanguagesParams,
} from '~/shared';

type Params = {} & Omit<
  UseMutationOptions<
    DeleteProfileLanguagesData,
    DeleteProfileLanguagesError,
    Omit<DeleteProfileLanguagesParams, 'accessToken'>
  >,
  'mutationFn'
>;

export function useDeleteProfileLanguages(params: Params = {}) {
  const auth = useAuth();
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const deleteProfileLanguagesResult = await deleteProfileLanguages({
        ...params,
        accessToken: auth!.accessToken,
      });

      if (deleteProfileLanguagesResult.ok) {
        const profile = deleteProfileLanguagesResult.data;
        return profile;
      }

      throw deleteProfileLanguagesResult.error;
    },
    ...params,
  });

  return { deleteProfileLanguages: mutate, ...mutation };
}
