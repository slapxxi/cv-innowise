import Avatar from '@mui/material/Avatar';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Link } from '@tanstack/react-router';
import type { User } from 'cv-graphql';
import * as React from 'react';

type PropsType = {
  userData: User;
  hiddenCell?: string;
};

export const UserRow = React.memo(({ userData, hiddenCell }: PropsType) => {
  const { profile, email, department_name, position_name } = { ...userData };

  return (
    <TableRow className={'w-full'}>
      <TableCell>
        <Link to="/users/$userId/profile" params={{ userId: userData.id }}>
          <Avatar src={profile.avatar ?? undefined}>{profile.full_name?.[0] || email[0]}</Avatar>
        </Link>
      </TableCell>
      <TableCell>{profile.first_name}</TableCell>
      <TableCell className={hiddenCell}>{profile.last_name}</TableCell>
      <TableCell className={hiddenCell}>{email}</TableCell>
      <TableCell>{department_name}</TableCell>
      <TableCell>{position_name}</TableCell>
    </TableRow>
  );
});
