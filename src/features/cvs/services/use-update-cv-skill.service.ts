import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import {
  updateCvSkill,
  type UpdateCvSkillData,
  type UpdateCvSkillError,
  type UpdateCvSkillParams,
} from '~/shared/lib/http';

type Params = {} & Omit<
  UseMutationOptions<UpdateCvSkillData, UpdateCvSkillError, Omit<UpdateCvSkillParams, 'accessToken'>>,
  'mutationFn'
>;

export function useUpdateCvSkill(params: Params = {}) {
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const updateCvSkillResult = await updateCvSkill({
        ...params,
      });

      if (updateCvSkillResult.ok) {
        const cv = updateCvSkillResult.data;
        return cv;
      }

      throw updateCvSkillResult.error;
    },
    ...params,
  });

  return { updateCvSkill: mutate, ...mutation };
}
