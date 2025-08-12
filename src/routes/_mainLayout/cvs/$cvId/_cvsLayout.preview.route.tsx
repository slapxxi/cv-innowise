import { createFileRoute } from '@tanstack/react-router';
import { cvOptions } from '~/features/cvs';
import { CvsPreviewPage } from '~/pages/cvs';
import { mergeBreadcrumbs } from '~/shared/utils';

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout/preview')({
  beforeLoad: ({ context, location }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Preview', to: location.pathname }),
    };
  },
  loader: ({ context, params }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(cvOptions({ id: params.cvId }));
  },
  component: CvsPreviewPage,
});
