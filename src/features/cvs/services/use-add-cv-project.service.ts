import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import {
  addCvProject,
  type AddCvProjectData,
  type AddCvProjectError,
  type AddCvProjectParams,
} from '~/shared/lib/http';

type Params = { cvId: string } & Omit<
  UseMutationOptions<AddCvProjectData, AddCvProjectError, Omit<AddCvProjectParams, 'accessToken' | 'cvId'>>,
  'mutationFn'
>;

export function useAddCvProject(params: Params) {
  const { cvId } = params;
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const addCvProjectResult = await addCvProject({
        ...params,
        cvId,
      });

      if (addCvProjectResult.ok) {
        const cv = addCvProjectResult.data;
        return cv;
      }

      throw addCvProjectResult.error;
    },
    ...params,
  });

  return { addCvProject: mutate, ...mutation };
}
