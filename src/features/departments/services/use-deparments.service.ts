import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import fuzzysort from 'fuzzysort';
import { useMemo } from 'react';
import {
  createComparator,
  getDepartments,
  type GetDepartmentsData,
  type GetDepartmentsError,
  type SortOrder,
} from '~/shared';

type QueryOptions = UseSuspenseQueryOptions<GetDepartmentsData, GetDepartmentsError>;

export const departmentsSortingFields = ['name'] as const;

const queryKey = ['departments'];

export const departmentsOptions = () => {
  return {
    queryKey,
    queryFn: async () => {
      const departmentsResult = await getDepartments();

      if (departmentsResult.ok) {
        return departmentsResult.data;
      }

      throw departmentsResult.error;
    },
    staleTime: Infinity,
  };
};

type DepartmentsSearchParams = Partial<{
  q: string;
  sort: (typeof departmentsSortingFields)[number];
  order: SortOrder;
}>;

type Params = {} & DepartmentsSearchParams & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function useDepartments(params: Params = {}) {
  const queryClient = useQueryClient();
  const { sort = 'name', q = '', order = 'asc', ...restParams } = params ?? {};
  const { data: departments, ...rest } = useSuspenseQuery({
    ...departmentsOptions(),
    ...restParams,
  });

  const searchedDepartments = useMemo(() => {
    const searchResults = fuzzysort.go(q, departments, {
      all: true,
      threshold: 0,
      keys: departmentsSortingFields,
    });

    const searchedDepartments = searchResults.map((result) => {
      const [name] = result;

      return {
        ...result.obj,
        highlights: {
          name: name.highlight(),
        },
      };
    });

    return searchedDepartments;
  }, [q, departments]);

  const sortedDepartments = useMemo(() => {
    return [...searchedDepartments].sort(createComparator(sort, order, (department, key) => department[key]));
  }, [searchedDepartments, sort, order]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey });
  }

  return {
    departments: sortedDepartments,
    total: sortedDepartments.length,
    invalidateDepartments: invalidate,
    ...rest,
  };
}
