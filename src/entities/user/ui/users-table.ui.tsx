import { Table, TableBody } from '@mui/material';
import { UserRow } from '~/entities';
import { type User } from '~/shared';
import { useState } from 'react';
import { useSortedUsers } from '~/entities/user/hooks/use-sorted-users.ts';
import { useAuth } from '~/app';
import { UsersTableHead } from '~/entities/user/ui/users-table-head.ui.tsx';

type UsersTableProps = {
  users: User[];
};

export const UsersTable: React.FC<UsersTableProps> = (props) => {
  const { users } = props;
  const auth = useAuth();
  const currentProfileId = auth?.user.id;

  const [orderBy, setOrderBy] = useState<string>('');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  const currentUser = users.find((u) => u.id == currentProfileId);
  const otherUsers = users.filter((u) => u.id !== currentProfileId);
  const sortedUsers = useSortedUsers(otherUsers, orderBy, orderDirection);

  const cellHidden = 'hidden md:table-cell';

  return (
    <Table className="mt-2">
      <UsersTableHead
        cellHidden={cellHidden}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        orderDirection={orderDirection}
        setOrderDirection={setOrderDirection}
      />
      <TableBody>
        {currentUser && <UserRow userData={currentUser} />}
        {sortedUsers.map((user) => (
          <UserRow hiddenCell={cellHidden} key={user.id} userData={user} />
        ))}
      </TableBody>
    </Table>
  );
};
