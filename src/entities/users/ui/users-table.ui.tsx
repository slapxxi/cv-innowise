import { ChevronRight as ChevronRightIcon, MoreVert as DotsIcon } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '~/app';
import { useUsers, type UsersSearchParams } from '~/features';
import {
  Highlight,
  IconButtonLink,
  MenuItemLink,
  OptionalLabel,
  Table,
  TableCell,
  UserAvatar,
  type NonUndefined,
} from '~/shared';

type UsersTableProps = {
  q: NonUndefined<UsersSearchParams['q']>;
  sort: NonUndefined<UsersSearchParams['sort']>;
} & Omit<React.ComponentProps<typeof Table>, 'data' | 'children' | 'headFields' | 'count' | 'sort'>;

export const UsersTable: React.FC<UsersTableProps> = (props) => {
  const { sort, page, limit, order, q, ...rest } = props;
  const { t } = useTranslation();
  const auth = useAuth();
  const { users, total } = useUsers({ sort, order, page, limit, q });
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function handleOpenMenu(e: React.MouseEvent<HTMLButtonElement>) {
    setMenuOpen(true);
    setAnchorEl(e.currentTarget);
  }

  function handleCloseMenu() {
    setMenuOpen(false);
    setAnchorEl(null);
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
      {(user) => (
        <>
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
          <TableCell>
            {auth!.user.id === user.id ? (
              <>
                <IconButton className="hover:opacity-55" onClick={handleOpenMenu}>
                  {auth!.user.id === user.id ? <DotsIcon /> : <ChevronRightIcon />}
                </IconButton>
                <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleCloseMenu}>
                  <MenuItemLink to="/users/$userId/profile" params={{ userId: user.id }}>
                    Profile
                  </MenuItemLink>
                  <MenuItem>Update user </MenuItem>
                  <MenuItem>Delete user</MenuItem>
                </Menu>
              </>
            ) : (
              <IconButtonLink to="/users/$userId/profile" params={{ userId: user.id }} className="hover:opacity-55">
                <ChevronRightIcon />
              </IconButtonLink>
            )}
          </TableCell>
        </>
      )}
    </Table>
  );
};
