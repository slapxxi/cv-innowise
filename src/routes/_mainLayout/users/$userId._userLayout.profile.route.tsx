import { PersonOutline } from '@mui/icons-material';
import { createFileRoute } from '@tanstack/react-router';
import { UserProfilePage, userOptions } from '~/pages/users';
import { type GetUserData } from '~/shared/lib/http';
import { mergeBreadcrumbs } from '~/shared/utils';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/profile')({
  beforeLoad: ({ params, context }) => {
    const { queryClient } = context;
    const user = queryClient.getQueryData<GetUserData>(['user', params.userId]);

    if (user) {
      return {
        breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, {
          title: user.profile.fullName ?? params.userId,
          to: '/users/$userId/profile',
          icon: <PersonOutline />,
        }),
      };
    }

    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, {
        title: params.userId,
        to: '/users/$userId/profile',
        icon: <PersonOutline />,
      }),
    };
  },
  loader: ({ context, params }) => {
    const { auth, queryClient } = context;
    queryClient.prefetchQuery(userOptions({ id: params.userId, accessToken: auth.accessToken! }));
  },
  component: UserProfilePage,
});
