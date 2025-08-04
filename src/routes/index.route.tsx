import { createFileRoute, redirect } from '@tanstack/react-router';
import { IndexPage } from '~/pages';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({ to: '/users', search: { page: 1, limit: 10, sort: 'firstName', order: 'asc', q: '' } });
    }
    throw redirect({ to: '/auth/login', search: { redirect: '/' } });
  },
  component: IndexPage,
});
