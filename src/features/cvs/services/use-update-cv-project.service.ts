import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '~/features';
import {
  updateCvProject,
  type UpdateCvProjectData,
  type UpdateCvProjectError,
  type UpdateCvProjectParams,
} from '~/shared';

type Params = { cvId: string; projectId: string } & Omit<
  UseMutationOptions<
    UpdateCvProjectData,
    UpdateCvProjectError,
    Omit<UpdateCvProjectParams, 'accessToken' | 'cvId' | 'projectId'>
  >,
  'mutationFn'
>;

export function useUpdateCvProject(params: Params) {
  const { cvId, projectId } = params;
  const auth = useAuth();
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const updateCvProjectResult = await updateCvProject({
        ...params,
        cvId,
        projectId,
        accessToken: auth.accessToken!,
      });

      if (updateCvProjectResult.ok) {
        const cv = updateCvProjectResult.data;
        return cv;
      }

      throw updateCvProjectResult.error;
    },
    ...params,
  });

  return { updateCvProject: mutate, ...mutation };
}
