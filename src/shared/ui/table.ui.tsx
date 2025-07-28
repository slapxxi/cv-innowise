import {
  Table as BaseTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { cn, switchOrder } from '../utils';
import type { SortOrder } from '../types';

export { TableCell, TableRow } from '@mui/material';

export type TableField = {
  id: string;
  title: string;
  child?: React.ReactNode;
};

export type ChangeSortHandler = (sort: string, order: SortOrder) => void;

type TableProps<T> = {
  data: T[];
  headFields: TableField[];
  sort: string;
  order: 'asc' | 'desc';
  children: (item: T, index: number) => React.ReactNode;
  onChangeSort: ChangeSortHandler;
  onChangePage?: (page: number) => void;
  onChangeRowsPerPage?: (limit: number) => void;
  page?: number;
  count?: number;
  limit?: number;
  fixedHeight?: boolean;
} & Omit<React.ComponentProps<typeof BaseTable>, 'children'>;

export const Table = <T extends { id: string }>(props: TableProps<T>) => {
  const {
    data,
    headFields,
    order,
    sort,
    page,
    limit,
    count,
    onChangeSort,
    onChangePage,
    onChangeRowsPerPage,
    children,
    fixedHeight = false,
    ...rest
  } = props;

  function handleChangeSort(item: TableField) {
    if (item.title === '') {
      return;
    }

    onChangeSort(item.id, item.id === sort ? switchOrder(order) : order);
  }

  function handleChangePage(_e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) {
    onChangePage?.(page);
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value, 10);
    onChangeRowsPerPage?.(value);
  }

  return (
    <>
      <TableContainer className={cn(fixedHeight && 'max-h-[calc(100vh-240px)] xl:max-h-[calc(100vh-200px)]')}>
        <BaseTable stickyHeader {...rest}>
          <TableHead>
            <TableRow>
              {headFields.map((field) => (
                <TableCell
                  key={field.id}
                  align={field.title === '' ? 'center' : 'left'}
                  sortDirection={order}
                  onClick={() => handleChangeSort(field)}
                  className="bg-transparent backdrop-blur bg-gradient-to-b from-bg to-bg/50 dark:from-bg-dark dark:to-bg-dark/70"
                >
                  {field.title !== '' ? (
                    <TableSortLabel active={field.id === sort} direction={order}>
                      {field.child || field.title}
                    </TableSortLabel>
                  ) : (
                    field.child || field.title
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>{data.map((item, i) => children(item, i))}</TableBody>
        </BaseTable>
      </TableContainer>

      {count && limit && page && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={count}
          rowsPerPage={limit}
          page={page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </>
  );
};
