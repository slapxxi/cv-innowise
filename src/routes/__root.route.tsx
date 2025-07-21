import { QueryClient } from '@tanstack/react-query';
import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { decodeJWT, getUser, type Auth, type User } from '~/shared';

export type CVRouterContext = {
  queryClient: QueryClient;
  auth: Auth;
};

export const Route = createRootRouteWithContext<CVRouterContext>()({
  beforeLoad: async ({ context }) => {
    const token = sessionStorage.getItem('access_token');

    if (token) {
      const { payload } = decodeJWT(token);

      if (payload.exp < Date.now() / 1000) {
        sessionStorage.removeItem('access_token');
        return { auth: { user: null } };
      }

      if (!context.auth.user) {
        const { queryClient } = context;
        const user = queryClient.getQueryData<User>(['auth', 'user']);

        if (user) {
          return { auth: { user } };
        }

        const userResult = await getUser({ id: payload.sub });

        if (userResult.ok) {
          const user = userResult.data;
          queryClient.setQueryData(['auth', 'user'], user);
          return { auth: { user } };
        }
      }
    }
  },
  component: () => {
    return (
      <>
        <HeadContent />
        <Outlet />
        <TanStackRouterDevtools position="top-right" />
      </>
    );
  },
});
