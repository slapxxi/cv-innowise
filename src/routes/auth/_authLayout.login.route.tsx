import { createFileRoute } from '@tanstack/react-router';
import i18n from '~/app/i18n.ts';
import { LoginForm } from '~/features';

export const Route = createFileRoute('/auth/_authLayout/login')({
  head: () => ({ meta: [{ title: i18n.t('Login') }] }),
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginForm />;
}
