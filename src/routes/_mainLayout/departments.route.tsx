import { MenuItem, TableRow } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { departmentsOptions, departmentsSortingFields, useDepartments } from '~/features';
import {
  ActionMenu,
  type ChangeSortHandler,
  Highlight,
  OptionalLabel,
  PageTitle,
  SearchField,
  Table,
  TableCell,
} from '~/shared';

const departmentsSearchSchema = z.object({
  sort: z.enum(departmentsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const Route = createFileRoute('/_mainLayout/departments')({
  component: RouteComponent,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(departmentsOptions());
  },
  validateSearch: departmentsSearchSchema,
});

function RouteComponent() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  const { departments } = useDepartments({ ...search });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const fd = new FormData(form);
    const q = fd.get('query');
    nav({ search: (prev) => ({ ...prev, q }) });
    e.preventDefault();
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, sort, order }) });
  };

  return (
    <section className="flex flex-col gap-4 p-6 py-4">
      <header className="sticky top-4 z-10 flex flex-col gap-2 bg-bg dark:bg-bg-dark">
        <PageTitle>{t('Departments')}</PageTitle>

        <form onSubmit={handleSearch} key={search.q}>
          <SearchField placeholder={t('Search')} defaultValue={search.q} name="query" autoFocus={search.q !== ''} />
        </form>
      </header>

      <Table
        data={departments}
        headFields={[
          { id: 'name', title: t('Department name') },
          { id: 'action', title: '' },
        ]}
        order={search.order}
        sort={search.sort}
        onChangeSort={handleChangeSort}
        fixedHeight
      >
        {(department) => (
          <TableRow key={department.id}>
            <TableCell>
              <Highlight value={department.highlights.name}>
                <OptionalLabel>{department.name}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <ActionMenu>
                <MenuItem>Update department </MenuItem>
                <MenuItem>Delete department</MenuItem>
              </ActionMenu>
            </TableCell>
          </TableRow>
        )}
      </Table>
    </section>
  );
}
