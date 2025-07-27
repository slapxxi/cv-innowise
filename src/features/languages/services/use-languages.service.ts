import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import fuzzysort from 'fuzzysort';
import { useMemo } from 'react';
import { useAuth } from '~/app';
import { createComparator, getLanguages, type GetLanguagesData, type GetLanguagesError } from '~/shared';

type QueryOptions = UseSuspenseQueryOptions<GetLanguagesData, GetLanguagesError>;

export const languagesSortingFields = ['name', 'nativeName', 'iso2'] as const;

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

type LanguagesSearchParams = Partial<{
  q: string;
  sort: (typeof languagesSortingFields)[number];
  order: 'asc' | 'desc';
}>;

type Params = {} & LanguagesSearchParams & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function useLanguages(params: Params = {}) {
  const queryClient = useQueryClient();
  const { sort = 'name', q = '', order = 'asc', ...restParams } = params ?? {};
  const auth = useAuth();
  const { data: languages, ...rest } = useSuspenseQuery({
    ...languagesOptions({ accessToken: auth!.accessToken }),
    ...restParams,
  });

  const searchedLanguages = useMemo(() => {
    const searchResults = fuzzysort.go(q, languages, {
      all: true,
      threshold: 0,
      keys: languagesSortingFields,
    });

    const searchedUsers = searchResults.map((result) => {
      const [name, nativeName, iso2] = result;

      return {
        ...result.obj,
        highlights: {
          name: name.highlight(),
          nativeName: nativeName.highlight(),
          iso2: iso2.highlight(),
        },
      };
    });

    return searchedUsers;
  }, [q, languages]);

  const sortedLanguages = useMemo(() => {
    return [...searchedLanguages].sort(createComparator(sort, order, (language, key) => language[key]));
  }, [searchedLanguages, sort, order]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['languages'] });
  }

  return {
    languages: sortedLanguages,
    total: sortedLanguages.length,
    invalidateUsers: invalidate,
    ...rest,
  };
}
