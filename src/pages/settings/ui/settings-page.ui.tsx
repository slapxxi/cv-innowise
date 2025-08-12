import { useTranslation } from 'react-i18next';
import { PageTitle } from '~/shared/ui';
import { Settings } from '.';

export function SettingsPage() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-4 p-6 py-4">
      <header className="flex flex-col gap-2">
        <PageTitle>{t('Settings')}</PageTitle>
      </header>

      <Settings />
    </section>
  );
}
