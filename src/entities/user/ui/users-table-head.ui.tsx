import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
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
    { key: '', title: '' },
    { key: 'first_name', title: t('First Name') },
    { key: 'last_name', title: t('Last Name') },
    { key: 'email', title: t('Email') },
    { key: 'department_name', title: t('Department') },
    { key: 'position_name', title: t('Position') },
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
            {index !== 0 && (
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
