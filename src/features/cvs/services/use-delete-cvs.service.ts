import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '~/features';
import { deleteCv, type DeleteCvData, type DeleteCvError, type DeleteCvParams } from '~/shared';

type Params = {} & Omit<
  UseMutationOptions<DeleteCvData, DeleteCvError, Omit<DeleteCvParams, 'accessToken'>>,
  'mutationFn'
>;

export function useDeleteCvs(params: Params = {}) {
  const auth = useAuth();
  const { mutate, ...mutation } = useMutation({
    mutationFn: async (params) => {
      const deleteCvsResult = await deleteCv({
        ...params,
        accessToken: auth.accessToken!,
      });

      if (deleteCvsResult.ok) {
        const cv = deleteCvsResult.data;
        return cv;
      }

      throw deleteCvsResult.error;
    },
    ...params,
  });

  return { deleteCvs: mutate, ...mutation };
}
