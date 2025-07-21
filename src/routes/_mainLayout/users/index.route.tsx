import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { queryClient, SearchField, Text } from '~/shared';
import i18n from '~/app/i18n.ts';
import { getUsers, UsersTable } from '~/entities';

export const Route = createFileRoute('/_mainLayout/users/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: i18n.t('Employees') }] }),
  loader: () =>
    queryClient.ensureQueryData({
      queryKey: ['users'],
      queryFn: getUsers,
    }),
});

function RouteComponent() {
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <section className="flex flex-col p-6 py-4">
      <header className="flex flex-col gap-2">
        <Text asChild>
          <h2>{t('Employees')}</h2>
        </Text>

        <form onSubmit={handleSearch}>
          <SearchField placeholder={t('Search')} />
          <UsersTable />
        </form>
      </header>
    </section>
  );
}
