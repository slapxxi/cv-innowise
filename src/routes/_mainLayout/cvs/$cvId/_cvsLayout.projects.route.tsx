import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout/projects')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    return { breadcrumb: { title: 'Projects', pathname: `/cvs/${params.cvId}/projects` } };
  },
});

function RouteComponent() {
  return <div>projects</div>;
}
