import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import fuzzysort from 'fuzzysort';
import { useMemo } from 'react';
import { getPositions, type GetPositionsData, type GetPositionsError } from '~/shared/lib/http';
import type { SortOrder } from '~/shared/types';
import { createComparator } from '~/shared/utils';

type QueryOptions = UseSuspenseQueryOptions<GetPositionsData, GetPositionsError>;

export const positionsSortingFields = ['name'] as const;

const queryKey = ['positions'];

export const positionsOptions = () => {
  return {
    queryKey,
    queryFn: async () => {
      const positionsResult = await getPositions();

      if (positionsResult.ok) {
        return positionsResult.data;
      }

      throw positionsResult.error;
    },
    staleTime: Infinity,
  };
};

type PositionsSearchParams = Partial<{
  q: string;
  sort: (typeof positionsSortingFields)[number];
  order: SortOrder;
}>;

type Params = {} & PositionsSearchParams & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function usePositions(params: Params = {}) {
  const queryClient = useQueryClient();
  const { sort = 'name', q = '', order = 'asc', ...restParams } = params ?? {};
  const { data: positions, ...rest } = useSuspenseQuery({
    ...positionsOptions(),
    ...restParams,
  });

  const searchedPositions = useMemo(() => {
    const searchResults = fuzzysort.go(q, positions, {
      all: true,
      threshold: 0,
      keys: positionsSortingFields,
    });

    const searchedPositions = searchResults.map((result) => {
      const [name] = result;

      return {
        ...result.obj,
        highlights: {
          name: name.highlight(),
        },
      };
    });

    return searchedPositions;
  }, [q, positions]);

  const sortedPositions = useMemo(() => {
    return [...searchedPositions].sort(createComparator(sort, order, (position, key) => position[key]));
  }, [searchedPositions, sort, order]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey });
  }

  return {
    positions: sortedPositions,
    total: sortedPositions.length,
    invalidatePositions: invalidate,
    ...rest,
  };
}
