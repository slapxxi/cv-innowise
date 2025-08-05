import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Sidebar } from '~/widgets';

export const Route = createFileRoute('/_mainLayout')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth) {
      throw redirect({ to: '/auth/login', search: { redirect: location.pathname } });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen xl:flex xl:gap-4">
      <Sidebar />

      <div className="w-full mb-[60px] xl:mb-0">
        <Outlet />
      </div>
    </div>
  );
}
