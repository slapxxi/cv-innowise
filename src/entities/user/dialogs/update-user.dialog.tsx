import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import { Suspense } from 'react';
import { useUpdateUser, useUpdateProfile, useUserFormData } from '~/entities/user/service';
import { useAuth } from '~/app';
import { CircularProgress, Box } from '@mui/material';
import { type User } from '~/shared';
import { useUserForm } from '~/entities/user/hooks/use-user-form-handlers.ts';
import { UserFormFields } from '~/entities/user/ui/users-table/user-form-fields';

type UpdateUserDialogPropsType = {
  dialogIsOpen: boolean;
  onClose: () => void;
  user: User;
};

const DialogFormSuspended = ({ user, onClose }: { user: User; onClose: () => void }) => {
  const auth = useAuth();
  const { data } = useUserFormData({ accessToken: auth!.accessToken });
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

  const updateUserMutation = useUpdateUser();
  const updateProfileMutation = useUpdateProfile();

  const handleSubmit = () => {
    updateProfileMutation.mutate(
      { userId: user.id, firstName: form.firstName, lastName: form.lastName },
      {
        onSuccess: () => {
          updateUserMutation.mutate(
            {
              userId: user.id,
              departmentId: form.departmentId,
              positionId: form.positionId,
              role: form.role,
            },
            {
              onSuccess: () => {
                onClose();
              },
            }
          );
        },
      }
    );
  };

  return (
    <>
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        <TextField label="Email" disabled fullWidth margin="dense" value={form.email || ''} />
        <TextField label="Password" value={'***********'} disabled fullWidth margin="dense" type="password" />
        <UserFormFields
          form={form}
          setForm={setForm}
          fields={['firstName', 'lastName', 'departmentId', 'positionId']}
          departments={departments}
          positions={positions}
          onChange={handleChange}
        />
        <TextField
          select
          disabled
          label="Role"
          fullWidth
          margin="dense"
          value={form.role || ''}
          onChange={handleChange('role')}
        >
          <MenuItem value="Employee">Employee</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>CANCEL</Button>
        <Button variant="contained" onClick={handleSubmit}>
          UPDATE
        </Button>
      </DialogActions>
    </>
  );
};

export const UpdateUserDialog = ({ dialogIsOpen, onClose, user }: UpdateUserDialogPropsType) => {
  return (
    <Dialog open={dialogIsOpen} onClose={onClose} fullWidth maxWidth="sm">
      <Suspense
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        }
      >
        <DialogFormSuspended user={user} onClose={onClose} />
      </Suspense>
    </Dialog>
  );
};
