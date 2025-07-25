import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import type { ChangeEvent } from 'react';
import { Suspense, useState } from 'react';
import { useUpdateUser, useUpdateProfile, useUserFormData } from '~/entities/user/service';
import { useAuth } from '~/app';
import { CircularProgress, Box } from '@mui/material';
import { type User } from '~/shared';

type UpdateUserDialogPropsType = {
  dialogIsOpen: boolean;
  onClose: () => void;
  user: User;
};

type FormType = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  departmentId?: string;
  departmentName?: string;
  positionId?: string;
  positionName?: string;
  role?: string;
};

const DialogFormSuspenced = ({ user, onClose }: { user: User; onClose: () => void }) => {
  const auth = useAuth();
  const updateUserMutation = useUpdateUser();
  const updateProfileMutation = useUpdateProfile();

  const { data } = useUserFormData({ accessToken: auth!.accessToken });
  const { departments, positions } = data;

  const [form, setForm] = useState<FormType>(() => ({
    email: user.email,
    firstName: user.profile?.firstName ?? '',
    lastName: user.profile?.lastName ?? '',
    role: user.role,
    departmentId: user.department?.id || '',
    departmentName: user.department?.name || '',
    positionId: user.position?.id || '',
    positionName: user.position?.name || '',
  }));

  const handleDepartmentChange = (e: ChangeEvent<{ value: unknown }>) => {
    const department = departments.find((d) => d.id === e.target.value);
    setForm((prev) => ({ ...prev, departmentId: department?.id || '', departmentName: department?.name || '' }));
  };

  const handlePositionChange = (e: ChangeEvent<{ value: unknown }>) => {
    const position = positions.find((p) => p.id === e.target.value);
    setForm((prev) => ({ ...prev, positionId: position?.id || '', positionName: position?.name || '' }));
  };

  const handleChange = (field: keyof FormType) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

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
        <TextField
          label="First Name"
          fullWidth
          margin="dense"
          value={form.firstName || ''}
          onChange={handleChange('firstName')}
        />
        <TextField
          label="Last Name"
          fullWidth
          margin="dense"
          value={form.lastName || ''}
          onChange={handleChange('lastName')}
        />
        <TextField
          select
          label="Department"
          fullWidth
          margin="dense"
          value={form.departmentId || ''}
          onChange={handleDepartmentChange}
        >
          {departments.map((dep) => (
            <MenuItem key={dep.id} value={dep.id}>
              {dep.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Position"
          fullWidth
          margin="dense"
          value={form.positionId || ''}
          onChange={handlePositionChange}
        >
          {positions.map((pos) => (
            <MenuItem key={pos.id} value={pos.id}>
              {pos.name}
            </MenuItem>
          ))}
        </TextField>
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
        <DialogFormSuspenced user={user} onClose={onClose} />
      </Suspense>
    </Dialog>
  );
};
