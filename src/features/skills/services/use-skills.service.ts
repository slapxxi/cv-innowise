import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import fuzzysort from 'fuzzysort';
import { useMemo } from 'react';
import { useAuth } from '~/app';
import { queryClient, type Skill } from '~/shared';
import { getSkills, type GetSkillsData, type GetSkillsError } from '~/shared/lib/http/get-skills.http';

export const skillsSortingFields = ['name', 'categoryName'] as const;

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

type SkillsSearchParams = Partial<{
  q: string;
  sort: (typeof skillsSortingFields)[number];
  order: 'asc' | 'desc';
}>;

type Params = {} & SkillsSearchParams & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function useSkills(params: Params = {}) {
  const { sort = 'name', order = 'asc', q = '', ...restParams } = params ?? {};
  const auth = useAuth();
  const { data: skills, ...rest } = useSuspenseQuery({
    ...skillsOptions({ accessToken: auth!.accessToken }),
    ...restParams,
  });

  const searchedSkills = useMemo(() => {
    const searchResults = fuzzysort.go(q, skills, {
      all: true,
      threshold: 0,
      keys: ['name', 'categoryName'],
    });

    const searchedUsers = searchResults.map((result) => {
      const [name, categoryName] = result;

      return {
        ...result.obj,
        highlights: {
          name: name.highlight(),
          categoryName: categoryName.highlight(),
        },
      };
    });

    return searchedUsers;
  }, [q, skills]);

  const sortedSkills = useMemo(() => {
    return [...searchedSkills].sort(createCompareFn(sort, order));
  }, [searchedSkills, sort, order]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['skills'] });
  }

  return {
    skills: sortedSkills,
    total: sortedSkills.length,
    invalidateUsers: invalidate,
    ...rest,
  };
}

// todo: extract to utils
function createCompareFn(sort: (typeof skillsSortingFields)[number], order: 'asc' | 'desc') {
  return (a: Skill, b: Skill) => {
    const isAsc = order === 'asc';
    const valA = a[sort];
    const valB = b[sort];

    if (typeof valA === 'string' && typeof valB === 'string') {
      if (valA === '') return isAsc ? 1 : -1;
      if (valB === '') return isAsc ? -1 : 1;

      const comparison = valA.localeCompare(valB);
      return isAsc ? comparison : -comparison;
    }

    // @ts-expect-error expected
    if (valA < valB) return isAsc ? -1 : 1;
    // @ts-expect-error expected
    if (valA > valB) return isAsc ? 1 : -1;

    return 0;
  };
}
