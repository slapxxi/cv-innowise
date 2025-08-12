import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import fuzzysort from 'fuzzysort';
import { useMemo } from 'react';
import {
  createComparator,
  getUsers,
  sliceCollection,
  type GetUsersData,
  type GetUsersError,
  type SortOrder,
  type User,
} from '~/shared';

type QueryOptions = UseSuspenseQueryOptions<GetUsersData, GetUsersError>;

export const usersSortingFields = ['firstName', 'lastName', 'email', 'positionName', 'departmentName'] as const;

export type UsersSortKey = (typeof usersSortingFields)[number];

export const usersOptions = () => {
  return {
    queryKey: ['users'],
    queryFn: async () => {
      const userResult = await getUsers();

      if (userResult.ok) {
        return userResult.data;
      }

      throw userResult.error;
    },
  };
};

export type UsersSearchParams = {
  q?: string;
  sort?: UsersSortKey;
  order?: SortOrder;
  page?: number;
  limit?: number;
};

export type UseUsersParams = {} & UsersSearchParams & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function useUsers(params: UseUsersParams) {
  const { q = '', sort = 'firstName', order = 'asc', page = 1, limit = 10, ...restParams } = params;
  const queryClient = useQueryClient();
  const { data: users, ...rest } = useSuspenseQuery({
    ...usersOptions(),
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
    return [...searchedUsers].sort(createComparator(sort, order, (user, key) => mapSortToProperty(user, key)));
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

function mapSortToProperty(user: User, sort: UsersSortKey) {
  let result;

  switch (sort) {
    case 'firstName':
      result = user.profile.firstName;
      break;
    case 'lastName':
      result = user.profile.lastName;
      break;
    default:
      result = user[sort];
  }

  return result ?? '';
}
