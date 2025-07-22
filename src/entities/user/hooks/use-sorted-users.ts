import { useMemo } from 'react';
import type { User } from '~/shared';

type Direction = 'asc' | 'desc';
type SortableKeys = 'first_name' | 'last_name' | 'email' | 'department_name' | 'position_name';
const accessorMap = {
  first_name: (u: User) => u.profile?.first_name,
  last_name: (u: User) => u.profile?.last_name,
  email: (u: User) => u.email,
  department_name: (u: User) => u.department_name,
  position_name: (u: User) => u.position_name,
};

export function useSortedUsers(users: User[], orderBy: string, direction: Direction) {
  return useMemo(() => {
    if (!orderBy || !accessorMap[orderBy as SortableKeys]) return users;

    const getValue = accessorMap[orderBy as SortableKeys];

    const usersCached = users.map((user) => ({
      user,
      value: getValue(user),
    }));

    usersCached.sort((a, b) => {
      const aVal = a.value;
      const bVal = b.value;

      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal === bVal) return 0;

      return direction === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });

    return usersCached.map(({ user }) => user);
  }, [users, orderBy, direction]);
}
