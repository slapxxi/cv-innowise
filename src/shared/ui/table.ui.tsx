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
import { cn } from '../utils';

export { TableCell } from '@mui/material';

export type TableField = {
  id: string;
  title: string;
};

type TableProps<T extends { id: string }> = {
  data: T[];
  headFields: TableField[];
  sort: string;
  order: 'asc' | 'desc';
  page: number;
  count: number;
  limit: number;
  children: (item: T) => React.ReactNode;
  onChangeSort: (field: TableField) => void;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (limit: number) => void;
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
    onChangeSort(item);
  }

  function handleChangePage(_e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) {
    onChangePage(page);
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value, 10);
    onChangeRowsPerPage(value);
  }

  return (
    <>
      <TableContainer className={cn(fixedHeight && 'max-h-[calc(100vh-180px)]')}>
        <BaseTable stickyHeader {...rest}>
          <TableHead>
            <TableRow>
              {headFields.map((field) => (
                <TableCell
                  key={field.id}
                  align="left"
                  sortDirection={order}
                  onClick={() => handleChangeSort(field)}
                  className="bg-transparent backdrop-blur bg-gradient-to-b from-bg to-bg/50 dark:from-bg-dark dark:to-bg-dark/70"
                >
                  {field.title !== '' ? (
                    <TableSortLabel active={field.id === sort} direction={order}>
                      {field.title}
                    </TableSortLabel>
                  ) : (
                    field.title
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>{children(item)}</TableRow>
            ))}
          </TableBody>
        </BaseTable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 75, 100, 380]}
        component="div"
        count={count}
        rowsPerPage={limit}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
