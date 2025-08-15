import { useTranslation } from 'react-i18next';
import { Title } from '~/shared/ui';
import { LoginForm } from '../forms';

export function LoginPage() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col">
      <header className="flex flex-col items-center gap-6 mb-10">
        <Title asChild>
          <h2>{t('Welcome back')}</h2>
        </Title>
        <p>{t('Happy to see you')}</p>
      </header>

      <LoginForm />
    </section>
  );
}
