import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '~/app';
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
        accessToken: auth!.accessToken,
      });

      if (createCvSkillResult.ok) {
        console.log(createCvSkillResult.data);
        const cv = createCvSkillResult.data;
        return cv;
      }

      throw createCvSkillResult.error;
    },
    ...params,
  });

  return { createCvSkill: mutate, ...mutation };
}
