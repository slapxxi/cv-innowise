import { QueryClient } from '@tanstack/react-query';
import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { decodeJWT, getUser, updateToken, type Auth } from '~/shared';

export type CVRouterContext = {
  queryClient: QueryClient;
  auth: Auth;
  breadcrumb?: { title: string; pathname: string; icon?: React.ReactNode };
};

export const Route = createRootRouteWithContext<CVRouterContext>()({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;
    const auth = queryClient.getQueryData<Auth>(['auth']);

    if (auth) {
      //check if accessToken is still fresh
      const { accessToken } = auth;
      const { payload } = decodeJWT(accessToken);

      // attempt to refresh token
      if (payload.exp < Date.now() / 1000) {
        const refreshToken = localStorage.getItem('refreshToken')!;
        const updateTokenResult = await updateToken({ refreshToken });

        if (updateTokenResult.ok) {
          const { accessToken, refreshToken } = updateTokenResult.data;
          localStorage.setItem('refreshToken', refreshToken);
          const { payload } = decodeJWT(accessToken);
          const getUserResult = await getUser({ id: payload.sub, accessToken });

          if (getUserResult.ok) {
            const user = getUserResult.data;
            queryClient.setQueryData(['auth'], { user, accessToken });
            return { auth: { user, accessToken } };
          }
        }
      }

      return { auth };
    }

    const refreshToken = localStorage.getItem('refreshToken');

    // attempt to refresh token
    if (refreshToken) {
      const updateTokenResult = await updateToken({ refreshToken });

      if (updateTokenResult.ok) {
        const { accessToken, refreshToken } = updateTokenResult.data;
        localStorage.setItem('refreshToken', refreshToken);
        const { payload } = decodeJWT(accessToken);
        const getUserResult = await getUser({ id: payload.sub, accessToken });

        if (getUserResult.ok) {
          const user = getUserResult.data;
          queryClient.setQueryData(['auth'], { user, accessToken });
          return { auth: { user, accessToken } };
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
        <ReactQueryDevtools initialIsOpen={false} />
      </>
    );
  },
});
