import Avatar from '@mui/material/Avatar';
import type { User } from '~/shared';

type UserAvatarProps = { user?: User | null } & React.ComponentProps<typeof Avatar>;

export const UserAvatar: React.FC<UserAvatarProps> = (props) => {
  const { user, ...rest } = props;
  return (
    <Avatar src={user?.profile.avatar ?? undefined} {...rest}>
      {user?.email[0].toUpperCase() || 'U'}
    </Avatar>
  );
};
