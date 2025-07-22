import { Tabs } from '@mui/material';
import { Outlet, useMatches } from '@tanstack/react-router';
import { TabLink } from '~/shared';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const matches = useMatches();

  return (
    <div>
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

      <Outlet />
    </div>
  );
}
