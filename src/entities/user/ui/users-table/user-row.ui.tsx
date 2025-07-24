import React from 'react';
import type { User } from 'cv-graphql';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import ArrowForwardIosRounded from '@mui/icons-material/ArrowForwardIosRounded';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from '@tanstack/react-router';
import { ActionsMenu } from '~/shared/ui/ActionsMenu.tsx';

type PropsType = {
  userData: User;
  hiddenCell?: string;
  isProfile?: boolean;
};

export const UserRow = React.memo(({ userData, hiddenCell, isProfile }: PropsType) => {
  const { profile, email, department_name, position_name } = { ...userData };
  const navigate = useNavigate();

  const handleUpdate = () => {};
  const handleDelete = () => {};
  return (
    <TableRow className={'w-full'}>
      <TableCell>
        <Avatar src={profile.avatar ?? undefined}>{profile.full_name?.[0] || email[0]}</Avatar>
      </TableCell>
      <TableCell>{profile.first_name}</TableCell>
      <TableCell className={hiddenCell}>{profile.last_name}</TableCell>
      <TableCell className={hiddenCell}>{email}</TableCell>
      <TableCell>{department_name}</TableCell>
      <TableCell>{position_name}</TableCell>
      <TableCell>
        {!isProfile ? (
          <IconButton>
            <ArrowForwardIosRounded onClick={() => navigate({ to: `/users/${profile.id}/profile` })} />
          </IconButton>
        ) : (
          <ActionsMenu>
            <MenuItem onClick={() => navigate({ to: `/users/${profile.id}/profile` })}>Profile</MenuItem>
            <MenuItem onClick={handleUpdate}>Update user </MenuItem>
            <MenuItem onClick={handleDelete}>Delete user</MenuItem>
          </ActionsMenu>
        )}
      </TableCell>
    </TableRow>
  );
});
