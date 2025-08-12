import { getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ChangeSortHandler, User } from '~/shared/types';
import { Modal, SearchContainer } from '~/shared/ui';
import { UsersTable } from '.';
import { UpdateUserForm } from '../forms';

const routeApi = getRouteApi('/_mainLayout/users/');

export function UsersPage() {
  const { t } = useTranslation();
  const search = routeApi.useSearch();
  const nav = routeApi.useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  function handleOpenDialog(user: User) {
    setSelectedUser(user);
    setDialogOpen(true);
  }

  function handleCloseDialog() {
    setDialogOpen(false);
    setSelectedUser(null);
  }

  const handleSearch = (q: string) => {
    nav({ search: (prev) => ({ ...prev, q, page: 1 }) });
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, page: 1, sort, order }) });
  };

  function handleChangePage(page: number) {
    nav({ search: (prev) => ({ ...prev, page: page + 1 }) });
  }

  function handleChangeRowsPerPage(rows: number) {
    nav({ search: (prev) => ({ ...prev, limit: rows, page: 1 }) });
  }

  return (
    <>
      <SearchContainer title={t('Employees')} query={search.q} onSearch={handleSearch}>
        <UsersTable
          key={search.page}
          fixedHeight
          onUpdate={handleOpenDialog}
          onChangeSort={handleChangeSort}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          {...search}
        />
      </SearchContainer>

      {selectedUser && (
        <Modal open={dialogOpen} onClose={handleCloseDialog} title={t('Update User')}>
          <UpdateUserForm onClose={handleCloseDialog} user={selectedUser} />
        </Modal>
      )}
    </>
  );
}
