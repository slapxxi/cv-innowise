import { createFileRoute } from '@tanstack/react-router';
import { cvsOptions } from '~/features/cvs';
import { UserCvsPage, userCvsSearchSchema } from '~/pages/users';
import { mergeBreadcrumbs } from '~/shared/utils';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/cvs')({
  component: UserCvsPage,
  beforeLoad: ({ context, search }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Cvs', to: '/users/$userId/cvs', props: { search } }),
    };
  },
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(cvsOptions());
  },
  validateSearch: userCvsSearchSchema,
});
