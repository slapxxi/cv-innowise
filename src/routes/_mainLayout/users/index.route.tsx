import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { SearchField, Text } from '~/shared';

export const Route = createFileRoute('/_mainLayout/users/')({
  component: RouteComponent,
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
        </form>
      </header>
    </section>
  );
}
