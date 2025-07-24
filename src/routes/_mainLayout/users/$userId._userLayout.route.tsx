import { Outlet, useMatches } from '@tanstack/react-router';
import { Breadcrumbs, TabLink, Tabs } from '~/shared';
import { createFileRoute } from '@tanstack/react-router';
import { getUserQueryOptions } from '~/features';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout')({
  component: RouteComponent,
  beforeLoad: () => {
    return { breadcrumb: { title: 'Employees', pathname: '/users' } };
  },
  loader: ({ params, context }) => {
    const { auth, queryClient } = context;
    queryClient.prefetchQuery(getUserQueryOptions({ id: params.userId, accessToken: auth!.accessToken }));
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const matches = useMatches();

  return (
    <div>
      <header className="sticky top-0 z-10 flex flex-col gap-1 bg-bg px-6 py-4 xl:px-0 dark:bg-bg-dark">
        <Breadcrumbs className="mb-4 pl-4" />

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
