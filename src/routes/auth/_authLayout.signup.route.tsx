import { createFileRoute, redirect } from '@tanstack/react-router';
import i18n from '~/app/i18n';
import { SignupPage } from '~/pages/auth';

export const Route = createFileRoute('/auth/_authLayout/signup')({
  head: () => ({ meta: [{ title: i18n.t('Signup') }] }),
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated()) {
      throw redirect({ to: '/' });
    }
  },
  component: SignupPage,
});
