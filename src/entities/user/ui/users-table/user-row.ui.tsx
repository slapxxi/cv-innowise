import React, { useState, useRef } from 'react';
import { ActionsMenu, IconButtonLink, MenuItemLink, type User, type ActionsMenuRef } from '~/shared';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import ArrowForwardIosRounded from '@mui/icons-material/ArrowForwardIosRounded';
import MenuItem from '@mui/material/MenuItem';
import { UpdateUserDialog } from '~/entities';
import { cn } from '~/shared';

type PropsType = {
  user: User;
  hiddenCell?: string;
  isProfile?: boolean;
};

export const UserRow = React.memo(({ user, hiddenCell, isProfile }: PropsType) => {
  const { profile, email, departmentName, positionName } = user;
  const [openDialog, setOpenDialog] = useState(false);
  const actionsMenuRef = useRef<ActionsMenuRef>(null);

  const handleUpdate = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    actionsMenuRef.current?.close();
  };
  const handleDelete = () => {};
  return (
    <>
      {user && isProfile && openDialog && (
        <UpdateUserDialog dialogIsOpen={openDialog} onClose={handleCloseDialog} user={user} />
      )}
      <TableRow className={'w-full'}>
        <TableCell>
          <Avatar src={profile.avatar ?? undefined}>{profile.fullName?.[0] || email[0]}</Avatar>
        </TableCell>
        <TableCell>{profile.firstName}</TableCell>
        <TableCell className={hiddenCell}>{profile.lastName}</TableCell>
        <TableCell className={cn(hiddenCell, 'break-words')}>{email}</TableCell>
        <TableCell>{departmentName}</TableCell>
        <TableCell>{positionName}</TableCell>
        <TableCell>
          {!isProfile ? (
            <IconButtonLink to="/users/$userId/profile" params={{ userId: user.id }}>
              <ArrowForwardIosRounded />
            </IconButtonLink>
          ) : (
            <ActionsMenu ref={actionsMenuRef}>
              <MenuItemLink to="/users/$userId/profile" params={{ userId: user.id }}>
                Profile
              </MenuItemLink>
              <MenuItem onClick={handleUpdate}>Update user </MenuItem>
              <MenuItem onClick={handleDelete}>Delete user</MenuItem>
            </ActionsMenu>
          )}
        </TableCell>
      </TableRow>
    </>
  );
});
