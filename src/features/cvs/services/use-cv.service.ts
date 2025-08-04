import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '~/features';
import { getCv, type GetCvData, type GetCvError } from '~/shared';

type QueryOptions = UseSuspenseQueryOptions<GetCvData, GetCvError>;

export const cvOptions = (params: { id: string; accessToken: string }) => {
  const { accessToken } = params;
  return {
    queryKey: ['cv', params.id],
    queryFn: async () => {
      const CvResult = await getCv({ id: params.id, accessToken });

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
  const auth = useAuth();
  const { data: cv, ...rest } = useSuspenseQuery({
    ...cvOptions({ id: params.id, accessToken: auth.accessToken! }),
    ...restParams,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['cv', params.id] });
  }

  return { cv, invalidateCv: invalidate, ...rest };
}
