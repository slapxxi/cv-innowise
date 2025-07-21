import { QueryClient } from '@tanstack/react-query';
import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { User } from '~/shared';

export type CVRouterContext = {
  queryClient: QueryClient;
  user: User | null;
};

export const Route = createRootRouteWithContext<CVRouterContext>()({
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
