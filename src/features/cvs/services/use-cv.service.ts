import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import { getCv, type GetCvData, type GetCvError } from '~/shared/lib/http';

type QueryOptions = UseSuspenseQueryOptions<GetCvData, GetCvError>;

export const cvOptions = (params: { id: string }) => {
  return {
    queryKey: ['cv', params.id],
    queryFn: async () => {
      const CvResult = await getCv({ id: params.id });

      if (CvResult.ok) {
        return CvResult.data;
      }

      throw CvResult.error;
    },
  };
};

type Params = { id: string } & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function useCv(params: Params) {
  const queryClient = useQueryClient();
  const { ...restParams } = params ?? {};
  const { data: cv, ...rest } = useSuspenseQuery({
    ...cvOptions({ id: params.id }),
    ...restParams,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['cv', params.id] });
  }

  return { cv, invalidateCv: invalidate, ...rest };
}
