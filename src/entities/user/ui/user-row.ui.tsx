import { TableCell, TableRow } from '@mui/material';
import type { User } from 'cv-graphql';
import Avatar from '@mui/material/Avatar';

type PropsType = {
  userData: User;
  hiddenCell?: string;
};
export const UserRow = ({ userData, hiddenCell }: PropsType) => {
  const { profile, email, department_name, position_name } = { ...userData };
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
    </TableRow>
  );
};
