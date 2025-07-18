import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button, ButtonLink, PasswordField, TextField, Title } from '~/shared';

export const Route = createFileRoute('/auth/_authLayout/signup')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Sign Up' }] }),
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col">
      <header className="flex flex-col items-center gap-6 mb-10">
        <Title asChild>
          <h2>{t('Register')}</h2>
        </Title>
        <p>{t('Welcome')}</p>
      </header>

      <div className="flex flex-col gap-4">
        <TextField label={t('Email')} type="email" />
        <PasswordField label={t('Password')} />
      </div>

      <div className="mt-15 flex flex-col gap-2 self-center">
        <Button>{t('Signup')}</Button>
        <ButtonLink to="/auth/login" variant="text">
          {t('I have an account')}
        </ButtonLink>
      </div>
    </section>
  );
}
