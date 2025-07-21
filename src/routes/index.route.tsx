import { createFileRoute, redirect } from '@tanstack/react-router';
import { IndexPage } from '~/pages';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/users' });
    }
    throw redirect({ to: '/auth/login', search: { redirect: '/' } });
  },
  component: IndexPage,
});
