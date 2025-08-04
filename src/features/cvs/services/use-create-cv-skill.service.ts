import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '~/features';
import { createCvSkill, type CreateCvSkillData, type CreateCvSkillError, type CreateCvSkillParams } from '~/shared';

type Params = {} & Omit<
  UseMutationOptions<CreateCvSkillData, CreateCvSkillError, Omit<CreateCvSkillParams, 'accessToken'>>,
  'mutationFn'
>;

export function useCreateCvSkill(params: Params = {}) {
  const auth = useAuth();
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const createCvSkillResult = await createCvSkill({
        ...params,
        accessToken: auth.accessToken!,
      });

      if (createCvSkillResult.ok) {
        const cv = createCvSkillResult.data;
        return cv;
      }

      throw createCvSkillResult.error;
    },
    ...params,
  });

  return { createCvSkill: mutate, ...mutation };
}
