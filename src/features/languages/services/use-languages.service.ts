import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '~/app';
import { getLanguages, type GetLanguagesData, type GetLanguagesError } from '~/shared';

type QueryOptions = UseSuspenseQueryOptions<GetLanguagesData, GetLanguagesError>;

export const languagesOptions = (params: { accessToken: string }) => {
  const { accessToken } = params;
  return {
    queryKey: ['languages'],
    queryFn: async () => {
      const categoriesResult = await getLanguages({ accessToken });

      if (categoriesResult.ok) {
        return categoriesResult.data;
      }

      throw categoriesResult.error;
    },
    staleTime: Infinity,
  };
};

type Params = {} & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function useLanguages(params: Params = {}) {
  const { ...restParams } = params ?? {};
  const auth = useAuth();
  const { data, ...rest } = useSuspenseQuery({
    ...languagesOptions({ accessToken: auth!.accessToken }),
    ...restParams,
  });
  return { languages: data, ...rest };
}
