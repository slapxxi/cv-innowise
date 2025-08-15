import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import {
  deleteCvSkills,
  type DeleteCvSkillsData,
  type DeleteCvSkillsError,
  type DeleteCvSkillsParams,
} from '~/shared/lib/http';

type Params = {} & Omit<
  UseMutationOptions<DeleteCvSkillsData, DeleteCvSkillsError, Omit<DeleteCvSkillsParams, 'accessToken'>>,
  'mutationFn'
>;

export function useDeleteCvSkills(params: Params = {}) {
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const deleteCvSkillsResult = await deleteCvSkills({
        ...params,
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
