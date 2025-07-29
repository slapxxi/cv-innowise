import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout/preview')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    return { breadcrumb: { title: 'Preview', pathname: `/cvs/${params.cvId}/preview` } };
  },
});

function RouteComponent() {
  return <div>preview</div>;
}
