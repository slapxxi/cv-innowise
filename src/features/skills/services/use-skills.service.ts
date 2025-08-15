import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import fuzzysort from 'fuzzysort';
import { useMemo } from 'react';
import { queryClient } from '~/shared/lib';
import { getSkills, type GetSkillsData, type GetSkillsError } from '~/shared/lib/http';
import { createComparator } from '~/shared/utils';

export const skillsSortingFields = ['name', 'categoryName'] as const;

type QueryOptions = UseSuspenseQueryOptions<GetSkillsData, GetSkillsError>;

export const skillsOptions = () => {
  return {
    queryKey: ['skills'],
    queryFn: async () => {
      const categoriesResult = await getSkills();

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
  const { data: skills, ...rest } = useSuspenseQuery({
    ...skillsOptions(),
    ...restParams,
  });

  const searchedSkills = useMemo(() => {
    const searchResults = fuzzysort.go(q, skills, {
      all: true,
      threshold: 0,
      keys: skillsSortingFields,
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
    return [...searchedSkills].sort(createComparator(sort, order, (skill, key) => skill[key]));
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
