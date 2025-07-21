import { QueryClient } from '@tanstack/react-query';
import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { type Auth, type User } from '~/shared';

export type CVRouterContext = {
  queryClient: QueryClient;
  auth: Auth;
};

export const Route = createRootRouteWithContext<CVRouterContext>()({
  beforeLoad: ({ context }) => {
    const qc = context.queryClient;
    const user = qc.getQueryData<User>(['auth', 'user']);
    return { auth: { user } };
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
