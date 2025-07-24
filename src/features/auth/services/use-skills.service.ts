import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '~/app';
import { getSkills, type GetSkillsData, type GetSkillsError } from '~/shared/lib/http/get-skills.http';

type QueryOptions = UseSuspenseQueryOptions<GetSkillsData, GetSkillsError>;

export const skillsOptions = (params: { accessToken: string }) => {
  const { accessToken } = params;
  return {
    queryKey: ['skills'],
    queryFn: async () => {
      const categoriesResult = await getSkills({ accessToken });

      if (categoriesResult.ok) {
        return categoriesResult.data;
      }

      throw categoriesResult.error;
    },
    staleTime: Infinity,
  };
};

type Params = {} & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function useSkills(params: Params = {}) {
  const { ...restParams } = params ?? {};
  const auth = useAuth();
  const { data, ...rest } = useSuspenseQuery({
    ...skillsOptions({ accessToken: auth!.accessToken }),
    ...restParams,
  });
  return { skills: data, ...rest };
}
