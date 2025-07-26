import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import fuzzysort from 'fuzzysort';
import { useMemo } from 'react';
import { useAuth } from '~/app';
import { getUsers, sliceCollection, type GetUsersData, type GetUsersError, type SortOrder, type User } from '~/shared';

type QueryOptions = UseSuspenseQueryOptions<GetUsersData, GetUsersError>;

export const usersSortingFields = ['firstName', 'lastName', 'email', 'positionName', 'departmentName'] as const;

export const usersOptions = (params: { accessToken: string }) => {
  const { accessToken } = params;
  return {
    queryKey: ['users'],
    queryFn: async () => {
      const userResult = await getUsers({ accessToken });

      if (userResult.ok) {
        return userResult.data;
      }

      throw userResult.error;
    },
  };
};

export type UsersSearchParams = {
  q?: string;
  sort?: (typeof usersSortingFields)[number];
  order?: SortOrder;
  page?: number;
  limit?: number;
};

export type UseUsersParams = {} & UsersSearchParams & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function useUsers(params: UseUsersParams) {
  const { q = '', sort = 'firstName', order = 'asc', page = 1, limit = 10, ...restParams } = params;
  const queryClient = useQueryClient();
  const auth = useAuth();
  const { data: users, ...rest } = useSuspenseQuery({
    ...usersOptions({ accessToken: auth!.accessToken }),
    ...restParams,
  });
  const searchedUsers = useMemo(() => {
    const searchResults = fuzzysort.go(q, users, {
      all: true,
      threshold: 0,
      keys: ['email', 'profile.firstName', 'profile.lastName', 'departmentName', 'positionName'],
    });

    const searchedUsers = searchResults.map((result) => {
      const [email, firstName, lastName, department, position] = result;

      return {
        ...result.obj,
        highlights: {
          email: email.highlight(),
          firstName: firstName.highlight(),
          lastName: lastName.highlight(),
          departmentName: department.highlight(),
          positionName: position.highlight(),
        },
      };
    });

    return searchedUsers;
  }, [q, users]);

  const sortedUsers = useMemo(() => {
    return [...searchedUsers].sort(createCompareFn(sort, order));
  }, [searchedUsers, sort, order]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  }

  return {
    users: sliceCollection(sortedUsers, { page, limit }),
    total: sortedUsers.length,
    invalidateUsers: invalidate,
    ...rest,
  };
}

function createCompareFn(sort: (typeof usersSortingFields)[number], order: 'asc' | 'desc') {
  const getValue = mapSortToProperty(sort);
  const isAsc = order === 'asc';

  return (a: User, b: User) => {
    const valA = getValue(a);
    const valB = getValue(b);

    if (typeof valA === 'string' && typeof valB === 'string') {
      if (valA === '') return isAsc ? 1 : -1;
      if (valB === '') return isAsc ? -1 : 1;

      const comparison = valA.localeCompare(valB);
      return isAsc ? comparison : -comparison;
    }

    if (valA < valB) return isAsc ? -1 : 1;
    if (valA > valB) return isAsc ? 1 : -1;

    return 0;
  };
}

function mapSortToProperty(sort: (typeof usersSortingFields)[number]) {
  return (user: User) => {
    let result;

    switch (sort) {
      case 'firstName':
        result = user.profile.firstName;
        break;
      case 'lastName':
        result = user.profile.lastName;
        break;
      case 'email':
        result = user.email;
        break;
      case 'positionName':
        result = user.positionName;
        break;
      case 'departmentName':
        result = user.departmentName;
        break;
    }

    return result?.toLowerCase() ?? '';
  };
}
