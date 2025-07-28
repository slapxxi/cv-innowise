import { Box } from '@mui/material';
import { type Profile, type User, UserAvatar } from '~/shared';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

type PropsType = {
  profile: Profile;
  user: User;
};
const UserMeta = ({ profile, user }: PropsType) => {
  const date = new Date(Number(user?.createdAt));
  const createdAt = `A member since ${date.toDateString()}`;
  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
        <UserAvatar sx={{ height: '120px', width: '120px', fontSize: '40px' }} src={profile.avatar ?? undefined}>
          {profile.fullName?.[0] || user.email[0]}
        </UserAvatar>

        <FileUploadOutlinedIcon onClick={() => {}} />
        <p> {user.profile.avatar ? 'Update' : 'Upload' + ' avatar image'}</p>
      </Box>
      <h2>{profile.fullName}</h2>
      <h3>Email: {user.email}</h3>
      <h3>{createdAt}</h3>
    </>
  );
};

export default UserMeta;
