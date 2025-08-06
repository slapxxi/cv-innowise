import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { createCv, type CreateCvData, type CreateCvError, type CreateCvParams } from '~/shared';

type Params = {} & Omit<
  UseMutationOptions<CreateCvData, CreateCvError, Omit<CreateCvParams, 'accessToken'>>,
  'mutationFn'
>;

export function useCreateCv(params: Params = {}) {
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const createCvResult = await createCv({ ...params });

      if (createCvResult.ok) {
        const cv = createCvResult.data;
        return cv;
      }

      throw createCvResult.error;
    },
    ...params,
  });

  return { createCv: mutate, ...mutation };
}
