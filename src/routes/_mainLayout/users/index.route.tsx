import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import i18n from '~/app/i18n.ts';
import { UsersTable } from '~/entities';
import { SearchField, Text, getUsers } from '~/shared';

export const Route = createFileRoute('/_mainLayout/users/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: i18n.t('Employees') }] }),
  loader: async ({ context }) => {
    const getUsersResult = await getUsers({ accessToken: context.auth!.accessToken });

    if (getUsersResult.ok) {
      const { users } = getUsersResult.data;
      return { users };
    }

    throw new Error('Handle this error!');
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  const { users } = Route.useLoaderData();

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
        </form>

        <UsersTable users={users} />
      </header>
    </section>
  );
}
