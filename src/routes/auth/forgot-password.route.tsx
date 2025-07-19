import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button, TextField, Title } from '~/shared';

export const Route = createFileRoute('/auth/forgot-password')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const nav = Route.useNavigate();
  return (
    <div className="flex h-screen items-center justify-center">
      <section className="flex w-full max-w-xl flex-col items-center p-6">
        <header className="mb-10 flex flex-col items-center gap-6">
          <Title asChild>
            <h2>{t('Forgot password')}</h2>
          </Title>
          <p className="text-center">{t('We will send you an email with further instructions')}</p>
        </header>

        <div className="flex w-full flex-col gap-4">
          <TextField placeholder="example@email.com" label={t('Email')} type="email" />
        </div>

        <div className="mt-15 flex flex-col gap-2 self-center">
          <Button>{t('Reset password')}</Button>
          <Button onClick={() => nav({ to: '/auth/login' })} variant="text">
            {t('Cancel')}
          </Button>
        </div>
      </section>
    </div>
  );
}
