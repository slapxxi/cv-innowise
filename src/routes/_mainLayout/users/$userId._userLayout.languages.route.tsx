import { createFileRoute } from '@tanstack/react-router';
import { languagesOptions } from '~/features/languages';
import { UserLanguagesPage } from '~/pages/users';
import { mergeBreadcrumbs } from '~/shared/utils';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/languages')({
  beforeLoad: ({ context }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Languages', to: '/users/$userId/languages' }),
    };
  },
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(languagesOptions());
  },
  component: UserLanguagesPage,
});
