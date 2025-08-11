import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { TableRow } from '@mui/material';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers, type UsersSearchParams } from '~/features';
import {
  ActionMenu,
  ActionMenuItem,
  Highlight,
  IconButtonLink,
  OptionalLabel,
  Table,
  TableCell,
  useAuth,
  UserAvatar,
  type NonUndefined,
  type User,
} from '~/shared';

type UsersTableProps = {
  q: NonUndefined<UsersSearchParams['q']>;
  sort: NonUndefined<UsersSearchParams['sort']>;
  onUpdate?: (user: User) => void;
  onDelete?: (user: User) => void;
} & Omit<React.ComponentProps<typeof Table>, 'data' | 'children' | 'headFields' | 'count' | 'sort'>;

export const UsersTable: React.FC<UsersTableProps> = (props) => {
  const { sort, page, limit, order, q, onUpdate, onDelete, ...rest } = props;
  const { t } = useTranslation();
  const auth = useAuth();
  const { users, total } = useUsers({ sort, order, page, limit, q });
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const navigate = useNavigate();

  function handleNavigate(user: User) {
    const userId = user.id;
    setMenuOpen(null);
    navigate({ to: `/users/${userId}/profile` });
  }

  function handleUpdate(user: User) {
    onUpdate?.(user);
    setMenuOpen(null);
  }

  function handleDelete(user: User) {
    onDelete?.(user);
    setMenuOpen(null);
  }

  return (
    <Table
      data={users}
      headFields={[
        { id: 'avatar', title: '' },
        { id: 'firstName', title: t('First Name') },
        { id: 'lastName', title: t('Last Name') },
        { id: 'email', title: t('Email') },
        { id: 'departmentName', title: t('Department') },
        { id: 'positionName', title: t('Position') },
        { id: 'action', title: '' },
      ]}
      count={total}
      page={page}
      limit={limit}
      sort={sort}
      order={order}
      {...rest}
    >
      {(user, i) => (
        <TableRow key={user.id}>
          <TableCell>
            <Link to="/users/$userId/profile" params={{ userId: user.id }}>
              <UserAvatar user={user} className="hover:opacity-55" />
            </Link>
          </TableCell>
          <TableCell>
            <Highlight value={user.highlights.firstName}>
              <OptionalLabel>{user.profile.firstName}</OptionalLabel>
            </Highlight>
          </TableCell>
          <TableCell>
            <Highlight value={user.highlights.lastName}>
              <OptionalLabel>{user.profile.lastName}</OptionalLabel>
            </Highlight>
          </TableCell>
          <TableCell>
            <Highlight value={user.highlights.email}>
              <OptionalLabel>{user.email}</OptionalLabel>
            </Highlight>
          </TableCell>
          <TableCell>
            <Highlight value={user.highlights.departmentName}>
              <OptionalLabel>{user.departmentName}</OptionalLabel>
            </Highlight>
          </TableCell>
          <TableCell>
            <Highlight value={user.highlights.positionName}>
              <OptionalLabel>{user.positionName}</OptionalLabel>
            </Highlight>
          </TableCell>
          <TableCell align="center">
            {auth.user!.id === user.id ? (
              <ActionMenu open={menuOpen === i} onOpen={() => setMenuOpen(i)} onClose={() => setMenuOpen(null)}>
                <ActionMenuItem onClick={() => handleNavigate(user)}>{t('Profile')}</ActionMenuItem>
                <ActionMenuItem onClick={() => handleUpdate(user)}>{t('Update user')}</ActionMenuItem>
                <ActionMenuItem onClick={() => handleDelete(user)}>{t('Delete user')}</ActionMenuItem>
              </ActionMenu>
            ) : (
              <IconButtonLink to="/users/$userId/profile" params={{ userId: user.id }} className="hover:opacity-55">
                <ChevronRightIcon />
              </IconButtonLink>
            )}
          </TableCell>
        </TableRow>
      )}
    </Table>
  );
};
