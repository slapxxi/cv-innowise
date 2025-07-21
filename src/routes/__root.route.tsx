import { QueryClient } from '@tanstack/react-query';
import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { User } from '~/shared';

export type CVRouterContext = {
  queryClient: QueryClient;
  user: User | null;
};

export const Route = createRootRouteWithContext<CVRouterContext>()({
  beforeLoad: ({ context }) => {
    console.log('root beforeLoad', { context });
  },
  loader: () => {
    console.log('root loader');
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
