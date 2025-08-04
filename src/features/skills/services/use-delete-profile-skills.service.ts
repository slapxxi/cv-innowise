import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '~/features';
import {
  deleteProfileSkills,
  type DeleteProfileSkillsData,
  type DeleteProfileSkillsError,
  type DeleteProfileSkillsParams,
} from '~/shared';

type Params = {} & Omit<
  UseMutationOptions<DeleteProfileSkillsData, DeleteProfileSkillsError, Omit<DeleteProfileSkillsParams, 'accessToken'>>,
  'mutationFn'
>;

export function useDeleteProfileSkills(params: Params = {}) {
  const auth = useAuth();
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const deleteProfileSkillsResult = await deleteProfileSkills({
        ...params,
        accessToken: auth.accessToken!,
      });

      if (deleteProfileSkillsResult.ok) {
        const profile = deleteProfileSkillsResult.data;
        return profile;
      }

      throw deleteProfileSkillsResult.error;
    },
    ...params,
  });

  return { deleteProfileSkills: mutate, ...mutation };
}
