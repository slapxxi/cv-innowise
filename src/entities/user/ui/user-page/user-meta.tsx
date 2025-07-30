import { Box, CircularProgress } from '@mui/material';
import { type Profile, type User, UserAvatar } from '~/shared';
import { toBase64 } from '~/shared/lib/to-base64';
import { useUploadAvatar } from '~/entities/user/service/use-upload-avatar.service.ts';
import { useRef, type ChangeEvent } from 'react';
import { InputFileUpload } from '~/shared/ui/input-file-upload.tsx';

type PropsType = {
  profile: Profile;
  user: User;
  isOwner: boolean;
};
export const UserMeta = ({ profile, user, isOwner }: PropsType) => {
  const { mutate: uploadAvatar, isPending } = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_AVATAR_SIZE_MB = 0.5;

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
      alert(`File size should not exceed ${MAX_AVATAR_SIZE_MB}MB`);
      return;
    }

    const base64 = await toBase64(file);

    uploadAvatar({ userId: user.id, base64, size: file.size, type: file.type });
  };

  const date = new Date(Number(user?.createdAt));
  const createdAt = `A member since ${date.toDateString()}`;
  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
        <UserAvatar sx={{ height: '120px', width: '120px', fontSize: '40px' }} src={profile.avatar ?? undefined}>
          {profile.fullName?.[0] || user.email[0]}
        </UserAvatar>
        {isOwner && (
          <>
            {isPending ? (
              <>
                <CircularProgress />
                Uploading...
              </>
            ) : (
              <InputFileUpload onChange={handleAvatarUpload} ref={fileInputRef}>
                <div className={'flex flex-col gap-2'}>
                  <p>{user.profile.avatar ? 'Update avatar image' : 'Upload avatar image'}</p>
                  <span style={{ fontSize: '12px', color: '#777' }}>png, jpg or gif no more than 0.5MB</span>
                </div>
              </InputFileUpload>
            )}
          </>
        )}
      </Box>
      <h5>{profile.fullName}</h5>
      <h3>Email: {user.email}</h3>
      <h3>{createdAt}</h3>
    </>
  );
};
