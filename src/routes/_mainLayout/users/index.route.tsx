import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { SearchContainer } from '~/app';
import i18n from '~/app/i18n.ts';
import { UsersTable } from '~/entities';
import { usersOptions, usersSortingFields } from '~/features';
import { type ChangeSortHandler } from '~/shared';

const searchSchema = z.object({
  page: z.number().min(1).catch(1),
  limit: z.number().min(1).max(100).catch(10),
  sort: z.enum(usersSortingFields).catch('firstName'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const Route = createFileRoute('/_mainLayout/users/')({
  head: () => ({ meta: [{ title: i18n.t('Employees') }] }),
  validateSearch: searchSchema,
  component: RouteComponent,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(usersOptions({ accessToken: context.auth!.accessToken }));
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const nav = Route.useNavigate();

  const handleSearch = (q: string) => {
    nav({ search: (prev) => ({ ...prev, q, page: 1 }) });
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, page: 1, sort, order }) });
  };

  function handleChangePage(page: number) {
    nav({ search: (prev) => ({ ...prev, page: page + 1 }) });
  }

  function handleChangeRowsPerPage(rows: number) {
    nav({ search: (prev) => ({ ...prev, limit: rows, page: 1 }) });
  }

  return (
    <SearchContainer title={t('Employees')} query={search.q} onSearch={handleSearch}>
      <UsersTable
        fixedHeight
        onChangeSort={handleChangeSort}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        {...search}
      />
    </SearchContainer>
  );
}
