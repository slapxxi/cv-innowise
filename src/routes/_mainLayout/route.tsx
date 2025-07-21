import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Sidebar } from './-nav.ui';

export const Route = createFileRoute('/_mainLayout')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.user) {
      throw redirect({ to: '/auth/login', search: { redirect: location.pathname } });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen xl:flex xl:gap-4">
      <Sidebar />
      <Outlet />
    </div>
  );
}
