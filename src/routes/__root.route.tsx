import { QueryClient } from '@tanstack/react-query';
import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export type CVRouterContext = {
  queryClient: QueryClient;
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
