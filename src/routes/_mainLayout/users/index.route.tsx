import { createFileRoute } from '@tanstack/react-router';
import { UsersPage, usersSearchSchema, usersOptions } from '~/pages/users';
import { i18n } from '~/shared/lib';

export const Route = createFileRoute('/_mainLayout/users/')({
  head: () => ({ meta: [{ title: i18n.t('Employees') }] }),
  validateSearch: usersSearchSchema,
  component: UsersPage,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(usersOptions());
  },
});
