import { createFileRoute } from '@tanstack/react-router';
import { CvPreview } from '~/features/cvs/ui/preview.tsx';
import { cvOptions, useCv, useCvProjects } from '~/features';
import { mergeBreadcrumbs } from '~/shared';

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout/preview')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Preview', to: location.pathname }),
    };
  },
  loader: ({ context, params }) => {
    const { queryClient, auth } = context;
    queryClient.prefetchQuery(cvOptions({ id: params.cvId, accessToken: auth!.accessToken }));
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const { cvProjects } = useCvProjects({ id: params.cvId });

  const { cv } = useCv({ id: params.cvId });

  return <CvPreview cv={cv} cvProjects={cvProjects} />;
}
