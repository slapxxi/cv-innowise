import { PersonOutline } from '@mui/icons-material';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { mergeBreadcrumbs, type GetUserData } from '~/shared'; //type User
import { UserPage } from '~/entities/user/ui/user-page/user-page.tsx';
import { userOptions, useUser } from '~/features';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/profile')({
  component: RouteComponent,
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
});

function RouteComponent() {
  const { userId } = useParams({ from: '/_mainLayout/users/$userId/_userLayout/profile' });
  const { user } = useUser({ id: userId });

  if (user) {
    return <UserPage user={user} />;
  }
}
