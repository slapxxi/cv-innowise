import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/profile')({
  component: RouteComponent,
  beforeLoad: () => {
    return { path: 'users/$userId/profile' };
  },
});

function RouteComponent() {
  return <div>Profile</div>;
}
