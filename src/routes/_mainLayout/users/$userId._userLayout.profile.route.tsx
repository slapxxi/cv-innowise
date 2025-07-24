import { PersonOutline } from '@mui/icons-material';
import { createFileRoute } from '@tanstack/react-router';
import { type User } from '~/shared';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/profile')({
  component: RouteComponent,
  beforeLoad: ({ params, context }) => {
    const { queryClient } = context;
    const user = queryClient.getQueryData<User>(['user', params.userId]);

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
      breadcumb: { title: 'User', pathname: `/users/${params.userId}/profile`, icon: <PersonOutline /> },
    };
  },
});

function RouteComponent() {
  return <div>Profile</div>;
}
