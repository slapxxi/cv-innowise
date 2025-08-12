import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { type BreadcrumbEntry, type User } from '~/shared/types';

export type CVRouterContext = {
  queryClient: QueryClient;
  auth: { accessToken: string | null; user: User | null; isAuthenticated: () => boolean };
  breadcrumbs?: BreadcrumbEntry[];
};

export const Route = createRootRouteWithContext<CVRouterContext>()({
  component: () => {
    return (
      <>
        <HeadContent />
        <Outlet />
        <TanStackRouterDevtools position="top-right" />
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
      </>
    );
  },
});
