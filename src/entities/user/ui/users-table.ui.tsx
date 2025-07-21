import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getUsers, UserRow } from '~/entities';

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
    { key: '', title: '' },
    { key: 'first_name', title: 'First Name' },
    { key: 'last_name', title: 'Last Name' },
    { key: 'email', title: 'Email' },
    { key: 'department_name', title: 'Department' },
    { key: 'position_name', title: 'Position' },
  ];

  const handleSortClick = () => {};
  if (isLoading) return <CircularProgress />;
  if (error) return <div>Users fetching error</div>;
  return (
    <Table className="mt-2">
      <TableHead>
        <TableRow>
          {tableHeadData.map((item, index) => (
            <TableCell className={'p-4'} key={item.key}>
              {item.title}
              {index !== 0 && <TableSortLabel onClick={handleSortClick} />}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {usersData?.map((user) => (
          <UserRow key={user.id} userData={user} />
        ))}
      </TableBody>
    </Table>
  );
};
