import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { type Dispatch, type SetStateAction } from 'react';
import { cn } from '~/shared';
import { useTranslation } from 'react-i18next';

type PropsType = {
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
  orderDirection: 'asc' | 'desc';
  setOrderDirection: Dispatch<SetStateAction<'asc' | 'desc'>>;
  cellHidden?: string;
};

export const UsersTableHead = ({ cellHidden, orderBy, setOrderBy, orderDirection, setOrderDirection }: PropsType) => {
  const { t } = useTranslation();
  const tableHeadData = [
    { key: '', title: '', sortable: false },
    { key: 'first_name', title: t('First Name'), sortable: true },
    { key: 'last_name', title: t('Last Name'), sortable: true },
    { key: 'email', title: t('Email'), sortable: true },
    { key: 'department_name', title: t('Department'), sortable: true },
    { key: 'position_name', title: t('Position'), sortable: true },
    { key: '', title: '', sortable: false },
  ];

  const handleSortClick = (key: string) => {
    if (orderBy === key) {
      setOrderDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderBy(key);
      setOrderDirection('asc');
    }
  };

  return (
    <TableHead className={'sticky top-0 bg z-10 align-middle'}>
      <TableRow>
        {tableHeadData.map((item, index) => (
          <TableCell
            className={cn(
              'bg-gradient-to-b from-[--color-bg] via-[--color-bg] to-transparent',
              'dark:from-[--color-bg-dark] dark:via-[--color-bg-dark]',
              'backdrop-blur-[2px] p-4  text-nowrap',
              `${index === 3 || index === 2 ? cellHidden : ''}`
            )}
            key={item.key}
          >
            {item.title}
            {item.sortable && (
              <TableSortLabel
                active={orderBy === item.key}
                direction={orderBy === item.key ? orderDirection : 'asc'}
                onClick={() => handleSortClick(item.key)}
              />
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
