import { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export type CVContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<CVContext>()({
  context: () => ({ queryClient: new QueryClient() }),
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
