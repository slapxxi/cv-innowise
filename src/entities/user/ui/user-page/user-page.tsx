import Box from '@mui/material/Box';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '~/app';
import { useUserForm } from '~/entities';
import { useFormIsChanged, useUpdateProfile, useUpdateUser, useUserFormData } from '~/entities/user/service';
import { UserFormFields, UserMeta } from '~/entities/user/ui';
import { Button, type User } from '~/shared';

type PropsType = {
  user: User;
};

export const UserPage = ({ user }: PropsType) => {
  const { profile, id } = user;
  const auth = useAuth();
  const isOwner = id === auth.user?.id;
  const navigate = useNavigate();
  const { data } = useUserFormData();
  const { departments, positions } = data;

  const { form, setForm, handleChange } = useUserForm({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    departmentId: user.department?.id || '',
    departmentName: user.department?.name || '',
    positionId: user.position?.id || '',
    positionName: user.position?.name || '',
  });
  const formIsChanged = useFormIsChanged(form, user);

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
          updateUserMutation.mutate(
            {
              userId: id,
              departmentId: form.departmentId,
              positionId: form.positionId,
            },
            {
              onSuccess: () => {
                navigate({ to: '/users', search: { page: 1, limit: 10, sort: 'firstName', order: 'asc', q: '' } });
              },
            }
          );
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
