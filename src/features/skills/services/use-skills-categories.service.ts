import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import { getSkillCategories, type GetSkillCategoriesData, type GetSkillCategoriesError } from '~/shared/lib/http';

type QueryOptions = UseSuspenseQueryOptions<GetSkillCategoriesData, GetSkillCategoriesError>;

export const getSkillCategoriesQueryOptions = () => {
  return {
    queryKey: ['categories'],
    queryFn: async () => {
      const categoriesResult = await getSkillCategories();

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
  const { data, ...rest } = useSuspenseQuery({
    ...getSkillCategoriesQueryOptions(),
    ...restParams,
  });
  return { categories: data, ...rest };
}
