import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { updateCv, type UpdateCvData, type UpdateCvError, type UpdateCvParams } from '~/shared';

type Params = {} & Omit<
  UseMutationOptions<UpdateCvData, UpdateCvError, Omit<UpdateCvParams, 'accessToken'>>,
  'mutationFn'
>;

export function useUpdateCv(params: Params = {}) {
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const updateCvResult = await updateCv({
        ...params,
      });

      if (updateCvResult.ok) {
        const cv = updateCvResult.data;
        return cv;
      }

      throw updateCvResult.error;
    },
    ...params,
  });

  return { updateCv: mutate, ...mutation };
}
