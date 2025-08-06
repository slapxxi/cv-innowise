import { createFileRoute } from '@tanstack/react-router';
import { t } from 'i18next';
import { Settings } from '~/entities';
import { PageTitle } from '~/shared';

export const Route = createFileRoute('/_mainLayout/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="flex flex-col gap-4 p-6 py-4">
      <header className="flex flex-col gap-2">
        <PageTitle>{t('Settings')}</PageTitle>
      </header>

      <Settings />
    </section>
  );
}
