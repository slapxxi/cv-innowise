import { createFileRoute } from '@tanstack/react-router';
import { UserLayout, userOptions } from '~/pages/users';
import { mergeBreadcrumbs } from '~/shared/utils';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout')({
  component: UserLayout,
  beforeLoad: ({ context }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Employees', to: '/users' }),
    };
  },
  loader: ({ params, context }) => {
    const { auth, queryClient } = context;
    queryClient.prefetchQuery(userOptions({ id: params.userId, accessToken: auth.accessToken! }));
  },
});
