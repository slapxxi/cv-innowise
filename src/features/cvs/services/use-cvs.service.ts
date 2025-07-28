import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import fuzzysort from 'fuzzysort';
import { useMemo } from 'react';
import { useAuth } from '~/app';
import { createComparator, getCvs, type Cv, type GetCvsData, type GetCvsError, type SortOrder } from '~/shared';

type QueryOptions = UseSuspenseQueryOptions<GetCvsData, GetCvsError>;

export const cvsSortingFields = ['name', 'description', 'education', 'employee'] as const;

type CvsSortKey = (typeof cvsSortingFields)[number];

const queryKey = ['cvs'];

export const cvsOptions = (params: { accessToken: string }) => {
  const { accessToken } = params;
  return {
    queryKey,
    queryFn: async () => {
      const cvsResult = await getCvs({ accessToken });

      if (cvsResult.ok) {
        return cvsResult.data;
      }

      throw cvsResult.error;
    },
  };
};

type CvsSearchParams = Partial<{
  q: string;
  sort: CvsSortKey;
  order: SortOrder;
}>;

type Params = {} & CvsSearchParams & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function useCvs(params: Params = {}) {
  const queryClient = useQueryClient();
  const { sort = 'name', q = '', order = 'asc', ...restParams } = params ?? {};
  const auth = useAuth();
  const { data: cvs, ...rest } = useSuspenseQuery({
    ...cvsOptions({ accessToken: auth!.accessToken }),
    ...restParams,
  });

  const searchedCvs = useMemo(() => {
    const searchResults = fuzzysort.go(q, cvs, {
      all: true,
      threshold: 0,
      keys: ['name', 'description', 'education', 'user.email'],
    });

    const searchedCvs = searchResults.map((result) => {
      const [name, description, education, userEmail] = result;

      return {
        ...result.obj,
        highlights: {
          name: name.highlight(),
          description: description.highlight(),
          education: education.highlight(),
          userEmail: userEmail.highlight(),
        },
      };
    });

    return searchedCvs;
  }, [q, cvs]);

  const sortedCvs = useMemo(() => {
    return [...searchedCvs].sort(createComparator(sort, order, (position, key) => mapSortToProperty(position, key)));
  }, [searchedCvs, sort, order]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey });
  }

  return {
    cvs: sortedCvs,
    total: sortedCvs.length,
    invalidateCvs: invalidate,
    ...rest,
  };
}

function mapSortToProperty(cv: Cv, sort: CvsSortKey) {
  let result;

  switch (sort) {
    case 'employee':
      result = cv.user?.email;
      break;
    default:
      result = cv[sort];
  }

  return result ?? '';
}
