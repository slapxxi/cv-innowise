import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '~/app';
import {
  updateProfileSkill,
  type UpdateProfileSkillData,
  type UpdateProfileSkillError,
  type UpdateProfileSkillParams,
} from '~/shared';

type Params = {} & Omit<
  UseMutationOptions<UpdateProfileSkillData, UpdateProfileSkillError, Omit<UpdateProfileSkillParams, 'accessToken'>>,
  'mutationFn'
>;

export function useUpdateProfileSkill(params: Params = {}) {
  const auth = useAuth();
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const updateProfileSkillResult = await updateProfileSkill({
        ...params,
        accessToken: auth!.accessToken,
      });

      if (updateProfileSkillResult.ok) {
        const profile = updateProfileSkillResult.data;
        return profile;
      }

      throw updateProfileSkillResult.error;
    },
    ...params,
  });

  return { updateProfileSkill: mutate, ...mutation };
}
