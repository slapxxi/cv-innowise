import Avatar from '@mui/material/Avatar';

type UserAvatarProps = {} & React.ComponentProps<typeof Avatar>;

export const UserAvatar: React.FC<UserAvatarProps> = (props) => {
  return <Avatar {...props} />;
};
