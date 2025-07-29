import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '~/app';
import { updateCvSkill, type UpdateCvSkillData, type UpdateCvSkillError, type UpdateCvSkillParams } from '~/shared';

type Params = {} & Omit<
  UseMutationOptions<UpdateCvSkillData, UpdateCvSkillError, Omit<UpdateCvSkillParams, 'accessToken'>>,
  'mutationFn'
>;

export function useUpdateCvSkill(params: Params = {}) {
  const auth = useAuth();
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const updateCvSkillResult = await updateCvSkill({
        ...params,
        accessToken: auth!.accessToken,
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
