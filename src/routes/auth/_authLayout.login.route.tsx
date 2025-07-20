import { createFileRoute } from '@tanstack/react-router';
import i18n from '~/app/i18n.ts';
import { LoginForm } from '~/features';
import { Title } from '~/shared';
import { t } from 'i18next';

export const Route = createFileRoute('/auth/_authLayout/login')({
  head: () => ({ meta: [{ title: i18n.t('Login') }] }),
  component: RouteComponent,
});

function RouteComponent() {
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
