import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button, PasswordField, TextField, Title } from '~/shared';

export const Route = createFileRoute('/_authLayout/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col">
      <header className="flex flex-col items-center gap-6 mb-10">
        <Title asChild>
          <h2>{t('Welcome back')}</h2>
        </Title>
        <p>{t('Happy to see you')}</p>
      </header>

      <div className="flex flex-col gap-4">
        <TextField label={t('Email')} type="email" />
        <PasswordField label={t('Password')} />
      </div>

      <div className="mt-15 flex flex-col gap-2 self-center">
        <Button>{t('Login')}</Button>
        <Button variant="text">{t('Forgot password')}</Button>
      </div>
    </section>
  );
}
