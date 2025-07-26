import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import i18n from '~/app/i18n.ts';
import { UsersTable } from '~/entities';
import { usersOptions, usersSortingFields } from '~/features';
import { PageTitle, SearchField, type TableField } from '~/shared';

i18n.changeLanguage('ru');

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

function switchOrder(order: 'asc' | 'desc') {
  return order === 'asc' ? 'desc' : 'asc';
}

function RouteComponent() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const nav = Route.useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const fd = new FormData(form);
    const q = fd.get('query');
    nav({ search: (prev) => ({ ...prev, q, page: 1 }) });
    e.preventDefault();
  };

  function handleChangeSort(item: TableField) {
    nav({
      search: (prev) => ({
        ...prev,
        page: 1,
        sort: item.id,
        order: item.id === prev.sort ? switchOrder(prev.order) : prev.order,
      }),
    });
  }

  function handleChangePage(page: number) {
    nav({ search: (prev) => ({ ...prev, page: page + 1 }) });
  }

  function handleChangeRowsPerPage(rows: number) {
    nav({ search: (prev) => ({ ...prev, limit: rows, page: 1 }) });
  }

  return (
    <section className="flex flex-col p-6 py-4">
      <header className="flex flex-col gap-2 bg-bg sticky top-4 z-10 dark:bg-bg-dark">
        <PageTitle>{t('Employees')}</PageTitle>

        <form onSubmit={handleSearch} key={search.q}>
          <SearchField placeholder={t('Search')} defaultValue={search.q} name="query" />
        </form>
      </header>

      <UsersTable
        fixedHeight
        onChangeSort={handleChangeSort}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        {...search}
      />
    </section>
  );
}
