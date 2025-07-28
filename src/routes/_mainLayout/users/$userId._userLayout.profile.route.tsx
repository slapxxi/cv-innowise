import { PersonOutline } from '@mui/icons-material';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { type GetUserData } from '~/shared'; //type User
import { UserPage } from '~/entities/user/ui/user-page/user-page.tsx';
import { getUserQueryOptions, useUser } from '~/features';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/profile')({
  component: RouteComponent,

  beforeLoad: async ({ params, context }) => {
    const { queryClient } = context;

    const user = await queryClient.ensureQueryData<GetUserData>({
      ...getUserQueryOptions({
        id: params.userId,
        accessToken: context.auth!.accessToken,
      }),
    });

    if (user) {
      return {
        breadcrumb: {
          title: user.profile.fullName,
          pathname: `/users/${params.userId}/profile`,
          icon: <PersonOutline />,
        },
      };
    }

    return {
      breadcrumb: { title: 'User', pathname: `/users/${params.userId}/profile`, icon: <PersonOutline /> },
      user,
    };
  },
});

function RouteComponent() {
  const { userId } = useParams({ from: '/_mainLayout/users/$userId/_userLayout/profile' });
  const { user } = useUser({ id: userId });

  if (user) {
    return <UserPage user={user} />;
  }
}
