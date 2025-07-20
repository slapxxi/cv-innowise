import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainLayout/users/$userId/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/users/"!</div>;
}
