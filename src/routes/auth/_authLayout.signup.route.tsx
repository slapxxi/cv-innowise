import { createFileRoute, redirect } from '@tanstack/react-router';
import { SignupPage } from '~/pages/auth';
import { i18n } from '~/shared/lib';

export const Route = createFileRoute('/auth/_authLayout/signup')({
  head: () => ({ meta: [{ title: i18n.t('Signup') }] }),
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated()) {
      throw redirect({ to: '/' });
    }
  },
  component: SignupPage,
});
