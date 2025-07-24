import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '~/app';
import { getSkillCategories, type GetSkillCategoriesData, type GetSkillCategoriesError } from '~/shared';

type QueryOptions = UseSuspenseQueryOptions<GetSkillCategoriesData, GetSkillCategoriesError>;

export const getSkillCategoriesQueryOptions = (params: { accessToken: string }) => {
  const { accessToken } = params;
  return {
    queryKey: ['categories'],
    queryFn: async () => {
      const categoriesResult = await getSkillCategories({ accessToken });

      if (categoriesResult.ok) {
        return categoriesResult.data;
      }

      throw categoriesResult.error;
    },
    staleTime: Infinity,
  };
};

type Params = {} & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function useSkillCategories(params: Params = {}) {
  const { ...restParams } = params ?? {};
  const auth = useAuth();
  const { data, ...rest } = useSuspenseQuery({
    ...getSkillCategoriesQueryOptions({ accessToken: auth!.accessToken }),
    ...restParams,
  });
  return { categories: data, ...rest };
}
