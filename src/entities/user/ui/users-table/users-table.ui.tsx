import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { UserRow, UsersTableHead, useSortedUsers } from '~/entities';
import { type User } from '~/shared';
import { type ChangeEvent, useMemo, useState } from 'react';
import { useAuth } from '~/app';
import React from 'react';
import TablePagination from '@mui/material/TablePagination';

type UsersTableProps = {
  users: User[];
};

export const UsersTable: React.FC<UsersTableProps> = (props) => {
  const { users } = props;
  const auth = useAuth();
  const currentProfileId = auth?.user.id;

  const [orderBy, setOrderBy] = useState<string>('');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const currentUser = users.find((u) => u.id == currentProfileId);
  const otherUsers = users.filter((u) => u.id !== currentProfileId);

  const paginatedUsers = useMemo(() => {
    const start = currentPage * rowsPerPage;
    return otherUsers.slice(start, start + rowsPerPage);
  }, [otherUsers, currentPage, rowsPerPage]);

  const sortedUsers = useSortedUsers(paginatedUsers, orderBy, orderDirection);

  const cellHidden = 'hidden md:table-cell';
  const itemsCount = users.length;

  function handleChangePage(_: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) {
    setCurrentPage(newPage);
  }

  function handleChangeRowsPerPage(event: ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(Number(event?.target.value));
    setCurrentPage(0);
  }

  return (
    <>
      <TablePagination
        count={itemsCount}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[20, 50, 75, 100, itemsCount]}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        component={'div'}
      />
      <Table className="mt-2">
        <UsersTableHead
          cellHidden={cellHidden}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          orderDirection={orderDirection}
          setOrderDirection={setOrderDirection}
        />
        <TableBody>
          {currentUser && <UserRow isProfile={true} user={currentUser} />}
          {sortedUsers.map((user) => (
            <UserRow hiddenCell={cellHidden} key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
    </>
  );
};
