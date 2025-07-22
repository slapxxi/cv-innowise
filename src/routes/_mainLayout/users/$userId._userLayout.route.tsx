import { Tabs } from '@mui/material';
import { Outlet, useMatches } from '@tanstack/react-router';
import { getUser, TabLink } from '~/shared';
import { createFileRoute } from '@tanstack/react-router';
import { useUser } from '~/features';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient, auth } = context;
    const cachedUser = queryClient.getQueryData(['user', params.userId]);

    if (cachedUser) {
      return { user: cachedUser };
    }

    const userResult = await getUser({ id: params.userId, accessToken: auth!.accessToken });

    if (userResult.ok) {
      queryClient.setQueryData(['user', params.userId], userResult.data);
      return { user: userResult.data };
    }
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const matches = useMatches();

  useUser({ id: params.userId });

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
