import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getUsers, UserRow } from '~/entities';
import { useTranslation } from 'react-i18next';

export const UsersTable = () => {
  const { t } = useTranslation();
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  //TODO translation, DataGrid
  const tableHeadData = [
    { key: '', title: '' },
    { key: 'first_name', title: t('First Name') },
    { key: 'last_name', title: t('Last Name') },
    { key: 'email', title: t('Email') },
    { key: 'department_name', title: t('Department') },
    { key: 'position_name', title: t('Position') },
  ];

  const handleSortClick = () => {};
  if (isLoading) return <CircularProgress />;
  if (error) return <div>Users fetching error</div>;
  const cellHidden = 'hidden md:table-cell';
  return (
    <Table className="mt-2">
      <TableHead className={'sticky top-0  bg z-10   align-middle'}>
        <TableRow>
          {tableHeadData.map((item, index) => (
            <TableCell className={`p-4 text-nowrap  ${index === 3 ? cellHidden : ''}`} key={item.key}>
              {item.title}
              {index !== 0 && <TableSortLabel onClick={handleSortClick} />}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {usersData?.map((user) => (
          <UserRow hiddenCell={cellHidden} key={user.id} userData={user} />
        ))}
      </TableBody>
    </Table>
  );
};
