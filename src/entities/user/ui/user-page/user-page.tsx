import { type User } from '~/shared';
import { useUserForm } from '~/entities/user/hooks/use-user-form-handlers.ts';
import { UserFormFields } from '~/entities/user/ui/users-table/user-form-fields.tsx';
import { useUpdateProfile, useUpdateUser, useUserFormData } from '~/entities/user/service';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useAuth } from '~/app';
import UserMeta from '~/entities/user/ui/user-page/user-meta.tsx';
import { useMemo } from 'react';

type PropsType = {
  user: User;
};

export const UserPage = ({ user }: PropsType) => {
  const { profile, id } = user;
  const auth = useAuth();
  const isOwner = id === auth?.user.id;
  const { data } = useUserFormData({ accessToken: auth!.accessToken });
  const { departments, positions } = data;

  const { form, setForm, handleChange } = useUserForm({
    firstName: profile?.firstName || '',
    lastName: profile.lastName || '',
    departmentId: user.department?.id || '',
    departmentName: user.department?.name || '',
    positionId: user.position?.id || '',
    positionName: user.position?.name || '',
  });
  const formIsChanged = useMemo(() => {
    return (
      form.firstName !== (profile?.firstName || '') ||
      form.lastName !== (profile?.lastName || '') ||
      form.departmentId !== (user.department?.id || '') ||
      form.positionId !== (user.position?.id || '')
    );
  }, [form, profile, user]);

  const updateUserMutation = useUpdateUser();
  const updateProfileMutation = useUpdateProfile();

  const handleSubmit = () => {
    updateProfileMutation.mutate(
      {
        userId: id,
        firstName: form.firstName,
        lastName: form.lastName,
      },
      {
        onSuccess: () => {
          updateUserMutation.mutate({
            userId: id,
            departmentId: form.departmentId,
            positionId: form.positionId,
          });
        },
      }
    );
  };

  return (
    <Box
      sx={{
        padding: '20px',
        mx: 'auto',
        maxWidth: '900px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <UserMeta isOwner={isOwner} profile={profile} user={user} />

      <UserFormFields
        className={'w-full grid grid-cols-1 xl:grid-cols-2 gap-4 '}
        isOwner={isOwner}
        form={form}
        setForm={setForm}
        departments={departments}
        positions={positions}
        fields={['firstName', 'lastName', 'departmentId', 'positionId']}
        onChange={handleChange}
      />
      {isOwner && (
        <Box className={'w-full grid grid-cols-1 xl:grid-cols-2 gap-4 '}>
          <Box />
          <Box className={'flex justify-end'}>
            <Button
              sx={{ borderRadius: '40px' }}
              disabled={!formIsChanged}
              variant="contained"
              className={'w-full'}
              onClick={handleSubmit}
            >
              Update
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
