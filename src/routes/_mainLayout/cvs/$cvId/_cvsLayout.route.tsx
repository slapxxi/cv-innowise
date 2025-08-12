import { createFileRoute } from '@tanstack/react-router';
import { cvOptions } from '~/features/cvs';
import { CvsLayout } from '~/pages/cvs';
import { type Cv } from '~/shared/types';
import { mergeBreadcrumbs } from '~/shared/utils';

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout')({
  beforeLoad: ({ params, context }) => {
    const { queryClient } = context;
    const cv = queryClient.getQueryData(['cv', params.cvId]) as Cv | undefined;

    if (cv) {
      return {
        breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Cvs', to: '/cvs' }, { title: cv.name }),
      };
    }

    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Cvs', to: '/cvs' }, { title: '...' }),
    };
  },
  loader: ({ context, params }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(cvOptions({ id: params.cvId }));
  },
  component: CvsLayout,
});
