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
    <div className="flex items-center justify-center h-screen ">
      <section className="flex flex-col items-center  w-full max-w-xl p-6 ">
        <header className="flex flex-col items-center gap-6 mb-10">
          <Title asChild>
            <h2>{t('Forgot password')}</h2>
          </Title>
          <p>{t('We will send you an email with further instructions')}</p>
        </header>

        <div className="flex flex-col gap-4  w-full  ">
          <TextField placeholder='example@email.com' label={'Email'} type="email" />
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
