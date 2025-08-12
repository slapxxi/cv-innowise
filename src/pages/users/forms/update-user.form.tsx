import { Box, CircularProgress } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import React, { Suspense } from 'react';
import { type User } from '~/shared/types';
import { Button } from '~/shared/ui';
import { useFormIsChanged, useUserForm } from '../hooks';
import { useUpdateProfile, useUpdateUser, useUserFormData } from '../services';
import { UserFormFields } from '../ui';

type Props = { user: User; onClose: () => void };

const UpdateUseFormSuspended: React.FC<Props> = ({ user, onClose }) => {
  const { data } = useUserFormData();
  const { departments, positions } = data;

  const { form, setForm, handleChange } = useUserForm({
    email: user.email,
    firstName: user.profile?.firstName || '',
    lastName: user.profile?.lastName || '',
    role: user.role,
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
      { userId: user.id, firstName: form.firstName, lastName: form.lastName },
      {
        onSuccess: () => {
          updateUserMutation.mutate(
            { userId: user.id, departmentId: form.departmentId, positionId: form.positionId, role: form.role },
            { onSuccess: () => onClose() }
          );
        },
      }
    );
  };

  return (
    <>
      <Box className={'grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2'}>
        <TextField label="Email" disabled fullWidth value={form.email || ''} />
        <TextField label="Password" value={'***********'} disabled fullWidth type="password" />
        <UserFormFields
          form={form}
          setForm={setForm}
          fields={['firstName', 'lastName', 'departmentId', 'positionId']}
          departments={departments}
          positions={positions}
          onChange={handleChange}
          isOwner={true}
          className={'col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4'}
        />
        <TextField select disabled label="Role" fullWidth value={form.role || ''} onChange={handleChange('role')}>
          <MenuItem value="Employee">Employee</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
        </TextField>
      </Box>
      <Box className={'w-full grid grid-cols-1 xl:grid-cols-2 gap-4 '}>
        <Box />
        <Box className="flex w-full gap-4 justify-between mt-4">
          <Button variant={'outlined'} className="w-1/2 rounded-[40px]" sx={{ borderColor: 'gray' }} onClick={onClose}>
            CANCEL
          </Button>
          <Button className="w-1/2 rounded-[40px]" variant="contained" onClick={handleSubmit} disabled={!formIsChanged}>
            UPDATE
          </Button>
        </Box>
      </Box>
    </>
  );
};

export const UpdateUserForm = ({ onClose, user }: Props) => {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      }
    >
      <UpdateUseFormSuspended user={user} onClose={onClose} />
    </Suspense>
  );
};
