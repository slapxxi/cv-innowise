import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Sidebar } from './-nav.ui';

export const Route = createFileRoute('/_mainLayout')({
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
