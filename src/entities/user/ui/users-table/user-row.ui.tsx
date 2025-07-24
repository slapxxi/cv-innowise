import ArrowForwardIosRounded from '@mui/icons-material/ArrowForwardIosRounded';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { ActionsMenu, IconButtonLink, MenuItemLink, UserAvatar, type User } from '~/shared';

type PropsType = {
  user: User;
  hiddenCell?: string;
  isProfile?: boolean;
};

export const UserRow = React.memo(({ user, hiddenCell, isProfile }: PropsType) => {
  const { profile, email, departmentName, positionName } = user;

  const handleUpdate = () => {};
  const handleDelete = () => {};

  return (
    <TableRow className={'w-full'}>
      <TableCell>
        <UserAvatar src={profile.avatar ?? undefined}>{profile.fullName?.[0] || email[0]}</UserAvatar>
      </TableCell>
      <TableCell>{profile.firstName}</TableCell>
      <TableCell className={hiddenCell}>{profile.lastName}</TableCell>
      <TableCell className={hiddenCell}>{email}</TableCell>
      <TableCell>{departmentName}</TableCell>
      <TableCell>{positionName}</TableCell>
      <TableCell>
        {!isProfile ? (
          <IconButtonLink to="/users/$userId/profile" params={{ userId: user.id }}>
            <ArrowForwardIosRounded />
          </IconButtonLink>
        ) : (
          <ActionsMenu>
            <MenuItemLink to="/users/$userId/profile" params={{ userId: user.id }}>
              Profile
            </MenuItemLink>
            <MenuItem onClick={handleUpdate}>Update user </MenuItem>
            <MenuItem onClick={handleDelete}>Delete user</MenuItem>
          </ActionsMenu>
        )}
      </TableCell>
    </TableRow>
  );
});
