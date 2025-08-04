import { MenuItem, TableRow } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { positionsOptions, positionsSortingFields, usePositions } from '~/features';
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

const positionsSearchSchema = z.object({
  sort: z.enum(positionsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const Route = createFileRoute('/_mainLayout/positions')({
  component: RouteComponent,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(positionsOptions({ accessToken: context.auth.accessToken! }));
  },
  validateSearch: positionsSearchSchema,
});

function RouteComponent() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  const { positions } = usePositions({ ...search });

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
        <PageTitle>{t('Positions')}</PageTitle>

        <form onSubmit={handleSearch} key={search.q}>
          <SearchField placeholder={t('Search')} defaultValue={search.q} name="query" autoFocus={search.q !== ''} />
        </form>
      </header>

      <Table
        data={positions}
        headFields={[
          { id: 'name', title: t('Position name') },
          { id: 'action', title: '' },
        ]}
        order={search.order}
        sort={search.sort}
        onChangeSort={handleChangeSort}
        fixedHeight
      >
        {(position) => (
          <TableRow key={position.id}>
            <TableCell>
              <Highlight value={position.highlights.name}>
                <OptionalLabel>{position.name}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <ActionMenu>
                <MenuItem>Update position </MenuItem>
                <MenuItem>Delete position</MenuItem>
              </ActionMenu>
            </TableCell>
          </TableRow>
        )}
      </Table>
    </section>
  );
}
