import { createFileRoute } from '@tanstack/react-router';
import { mergeBreadcrumbs } from '~/shared';

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout/preview')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Preview', to: location.pathname }),
    };
  },
});

function RouteComponent() {
  return <div>preview</div>;
}
