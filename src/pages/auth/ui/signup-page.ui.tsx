import { useTranslation } from 'react-i18next';
import { Title } from '~/shared/ui';
import { SignupForm } from '../forms';

export function SignupPage() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col">
      <header className="flex flex-col items-center gap-6 mb-10">
        <Title asChild>
          <h2>{t('Register')}</h2>
        </Title>
        <p>{t('Welcome')}</p>
      </header>
      <SignupForm />
    </section>
  );
}
