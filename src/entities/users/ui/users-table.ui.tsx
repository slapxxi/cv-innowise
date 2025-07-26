import { ChevronRight as ChevronRightIcon, MoreVert as DotsIcon } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Link } from '@tanstack/react-router';
import fuzzysort from 'fuzzysort';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '~/app';
import { useUsers } from '~/features';
import {
  Highlight,
  IconButtonLink,
  MenuItemLink,
  OptionalLabel,
  sliceCollection,
  Table,
  TableCell,
  UserAvatar,
  type User,
} from '~/shared';

export const usersSortingFields = ['firstName', 'lastName', 'email', 'positionName', 'departmentName'] as const;

function mapSortToProperty(sort: (typeof usersSortingFields)[number]) {
  return (user: User) => {
    let result;

    switch (sort) {
      case 'firstName':
        result = user.profile.firstName;
        break;
      case 'lastName':
        result = user.profile.lastName;
        break;
      case 'email':
        result = user.email;
        break;
      case 'positionName':
        result = user.positionName;
        break;
      case 'departmentName':
        result = user.departmentName;
        break;
    }

    return result?.toLowerCase() ?? '';
  };
}

function createCompareFn(sort: (typeof usersSortingFields)[number], order: 'asc' | 'desc') {
  const getValue = mapSortToProperty(sort);
  const isAsc = order === 'asc';

  return (a: User, b: User) => {
    const valA = getValue(a);
    const valB = getValue(b);

    if (typeof valA === 'string' && typeof valB === 'string') {
      const comparison = valA.localeCompare(valB);
      return isAsc ? comparison : -comparison;
    }

    if (valA < valB) return isAsc ? -1 : 1;
    if (valA > valB) return isAsc ? 1 : -1;

    return 0;
  };
}

type UsersTableProps = { q: string; sort: (typeof usersSortingFields)[number] } & Omit<
  React.ComponentProps<typeof Table>,
  'data' | 'children' | 'headFields' | 'count' | 'sort'
>;

export const UsersTable: React.FC<UsersTableProps> = (props) => {
  const { sort, page, limit, order, q, onChangeSort, onChangePage, onChangeRowsPerPage } = props;
  const { t } = useTranslation();
  const { users } = useUsers();
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const searchResults = fuzzysort.go(q, users, {
    threshold: 0,
    keys: ['email', 'profile.firstName', 'profile.lastName', 'departmentName', 'positionName'],
    all: true,
  });

  const searchedUsers = searchResults.map((result) => {
    const [email, firstName, lastName, department, position] = result;

    return {
      ...result.obj,
      highlights: {
        email: email.highlight(),
        firstName: firstName.highlight(),
        lastName: lastName.highlight(),
        departmentName: department.highlight(),
        positionName: position.highlight(),
      },
    };
  });

  const sortedUsers = [...searchedUsers].sort(createCompareFn(sort, order));

  const filteredUsers = sortedUsers;

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
      data={sliceCollection(filteredUsers, { page, limit })}
      headFields={[
        { id: 'avatar', title: '' },
        { id: 'firstName', title: t('First Name') },
        { id: 'lastName', title: t('Last Name') },
        { id: 'email', title: t('Email') },
        { id: 'departmentName', title: t('Department') },
        { id: 'positionName', title: t('Position') },
        { id: 'action', title: '' },
      ]}
      count={filteredUsers.length}
      order={order}
      sort={sort}
      page={page}
      limit={limit}
      onChangePage={onChangePage}
      onChangeSort={onChangeSort}
      onChangeRowsPerPage={onChangeRowsPerPage}
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
