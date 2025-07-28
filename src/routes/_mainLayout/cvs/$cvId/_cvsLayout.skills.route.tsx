import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout/skills')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    return { breadcrumb: { title: 'Skills', pathname: `/cvs/${params.cvId}/skills` } };
  },
});

function RouteComponent() {
  return <div>skills</div>;
}
