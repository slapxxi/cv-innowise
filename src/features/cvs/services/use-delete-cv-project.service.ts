import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import {
  deleteCvProject,
  type DeleteCvProjectData,
  type DeleteCvProjectError,
  type DeleteCvProjectParams,
} from '~/shared';

type Params = {} & Omit<
  UseMutationOptions<DeleteCvProjectData, DeleteCvProjectError, Omit<DeleteCvProjectParams, 'accessToken'>>,
  'mutationFn'
>;

export function useDeleteCvProject(params: Params = {}) {
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const deleteCvProjectsResult = await deleteCvProject({
        ...params,
      });

      if (deleteCvProjectsResult.ok) {
        const cv = deleteCvProjectsResult.data;
        return cv;
      }

      throw deleteCvProjectsResult.error;
    },
    ...params,
  });

  return { deleteCvProject: mutate, ...mutation };
}
