import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import i18n from '~/app/i18n';
import { SignupForm } from '~/features';
import { Title } from '~/shared';

export const Route = createFileRoute('/auth/_authLayout/signup')({
  head: () => ({ meta: [{ title: i18n.t('Signup') }] }),
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({ to: '/' });
    }
  },
  component: RouteComponent,
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

      <SignupForm />
    </section>
  );
}
