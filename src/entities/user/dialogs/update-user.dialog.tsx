import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import MenuItem from '@mui/material/MenuItem';
import DialogActions from '@mui/material/DialogActions';
import React, { useState } from 'react';
import { type User } from '~/shared';
import { useUpdateUser, useUserFormData } from '~/entities/user/service';
import { useAuth } from '~/app';

type PropsType = {
  dialogIsOpen: boolean;
  onClose: () => void;
  user: User;
};

export const UpdateUserDialog = ({ dialogIsOpen, onClose, user }: PropsType) => {
  const auth = useAuth();
  console.log(auth!.accessToken);
  const { update } = useUpdateUser();
  const { data } = useUserFormData({ accessToken: auth!.accessToken });
  const { departments, positions } = data ?? { departments: [], positions: [] };
  const [form, setForm] = useState({
    email: user.email,
    password: '',
    firstName: user.profile?.firstName,
    lastName: user.profile?.lastName,
    departmentName: user.departmentName,
    positionName: user.positionName,
    role: user.role,
  });

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSumbmit = () => {
    update({ userId: user.id, ...form });
  };
  return (
    <>
      <Dialog open={dialogIsOpen} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <TextField label="Email" disabled fullWidth margin="dense" value={form.email} />
          <TextField label="Password" value={'***********'} disabled fullWidth margin="dense" type="password" />
          <TextField
            label="First Name"
            fullWidth
            margin="dense"
            value={form.firstName}
            onChange={handleChange('firstName')}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="dense"
            value={form.lastName}
            onChange={handleChange('lastName')}
          />
          <TextField
            select
            label="Department"
            fullWidth
            margin="dense"
            value={form.departmentName}
            onChange={handleChange('departmentName')}
          >
            {departments.map((dep) => (
              <MenuItem key={dep.id} value={dep.name}>
                {dep.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Position"
            fullWidth
            margin="dense"
            value={form.positionName}
            onChange={handleChange('positionName')}
          >
            {positions.map((pos) => (
              <MenuItem key={pos.id} value={pos.name}>
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
            value={form.role}
            onChange={handleChange('role')}
          >
            <MenuItem value="Employee">Employee</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>CANCEL</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleSumbmit();
              console.log('Updated', form);
            }}
          >
            UPDATE
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
