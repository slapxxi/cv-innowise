import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '~/app';
import { deleteCvSkills, type DeleteCvSkillsData, type DeleteCvSkillsError, type DeleteCvSkillsParams } from '~/shared';

type Params = {} & Omit<
  UseMutationOptions<DeleteCvSkillsData, DeleteCvSkillsError, Omit<DeleteCvSkillsParams, 'accessToken'>>,
  'mutationFn'
>;

export function useDeleteCvSkills(params: Params = {}) {
  const auth = useAuth();
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const deleteCvSkillsResult = await deleteCvSkills({
        ...params,
        accessToken: auth!.accessToken,
      });

      if (deleteCvSkillsResult.ok) {
        const cv = deleteCvSkillsResult.data;
        return cv;
      }

      throw deleteCvSkillsResult.error;
    },
    ...params,
  });

  return { deleteCvSkills: mutate, ...mutation };
}
