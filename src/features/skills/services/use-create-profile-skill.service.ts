import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import {
  createProfileSkill,
  type CreateProfileSkillData,
  type CreateProfileSkillError,
  type CreateProfileSkillParams,
} from '~/shared/lib/http';

type Params = {} & Omit<
  UseMutationOptions<CreateProfileSkillData, CreateProfileSkillError, Omit<CreateProfileSkillParams, 'accessToken'>>,
  'mutationFn'
>;

export function useCreateProfileSkill(params: Params = {}) {
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const createProfileSkillResult = await createProfileSkill({
        ...params,
      });

      if (createProfileSkillResult.ok) {
        const profile = createProfileSkillResult.data;
        return profile;
      }

      throw createProfileSkillResult.error;
    },
    ...params,
  });

  return { createProfileSkill: mutate, ...mutation };
}
