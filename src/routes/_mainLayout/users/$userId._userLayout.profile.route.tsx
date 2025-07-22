import { createFileRoute } from '@tanstack/react-router';
import { PersonOutline } from '@mui/icons-material';
import { getUser, type User } from '~/shared';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/profile')({
  component: RouteComponent,
  beforeLoad: ({ params, context }) => {
    const { queryClient, auth } = context;
    const user = queryClient.getQueryData<User>(['user', params.userId]);

    if (user) {
      return {
        breadcrumb: {
          title: user.profile.full_name,
          pathname: `/users/${params.userId}/profile`,
          icon: <PersonOutline />,
        },
      };
    }

    queryClient.prefetchQuery({
      queryKey: ['user', params.userId],
      queryFn: async () => {
        const userResult = await getUser({ id: params.userId, accessToken: auth!.accessToken });
        if (userResult.ok) {
          return userResult.data;
        }
        throw userResult.error;
      },
    });
  },
});

function RouteComponent() {
  return <div>Profile</div>;
}
