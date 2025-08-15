import { createFileRoute, redirect } from '@tanstack/react-router';
import { i18n } from '~/shared/lib';
import { LoginPage } from '~/pages/auth';

export const Route = createFileRoute('/auth/_authLayout/login')({
  head: () => ({ meta: [{ title: i18n.t('Login') }] }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated()) {
      throw redirect({ to: search.redirect });
    }
  },
  component: LoginPage,
});
