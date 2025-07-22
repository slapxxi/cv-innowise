import { Outlet, useMatches } from '@tanstack/react-router';
import { Breadcrumbs, TabLink, Tabs } from '~/shared';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout')({
  component: RouteComponent,
  beforeLoad: () => {
    return { breadcrumb: { title: 'Employees', pathname: '/users' } };
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const matches = useMatches();

  return (
    <div className="px-6 py-4">
      <header className="flex flex-col gap-1">
        <Breadcrumbs />

        <Tabs value={matches.at(-1)?.fullPath ?? ''}>
          <TabLink
            to="/users/$userId/profile"
            params={{ userId: params.userId }}
            value="/users/$userId/profile"
            label="Profile"
          />
          <TabLink
            to="/users/$userId/skills"
            params={{ userId: params.userId }}
            value="/users/$userId/skills"
            label="Skills"
          />
          <TabLink
            to="/users/$userId/languages"
            params={{ userId: params.userId }}
            value="/users/$userId/languages"
            label="Languages"
          />
        </Tabs>
      </header>

      <Outlet />
    </div>
  );
}
