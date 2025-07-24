import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainLayout/cvs')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>cvs</div>;
}
