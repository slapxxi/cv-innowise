import { Table, TableCell, TableRow, TableSortLabel } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '~/entities/user/api/users.api.ts';
import { UserRow } from '~/entities/user/ui/user-row.ui.tsx';

export const UsersTable = () => {
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const tableHeadData = [
    { key: 'profile.first_name', title: 'First Name' },
    { key: 'profile.last_name', title: 'Last Name' },
    { key: 'email', title: 'Email' },
    { key: 'department_name', title: 'Department' },
    { key: 'position_name', title: 'Position' },
  ];
  const handleSortClick = () => {};
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Users fetching error</div>;
  console.log(usersData);
  return (
    <Table>
      <TableRow>
        {tableHeadData.map((item) => (
          <TableCell key={item.key}>
            <TableSortLabel onClick={handleSortClick} />
          </TableCell>
        ))}
      </TableRow>
      {usersData?.map((user) => (
        <UserRow key={user.id} userData={user} />
      ))}
    </Table>
  );
};
