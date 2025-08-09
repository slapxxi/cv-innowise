import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { type ChangeSortHandler, Modal, type User } from '~/shared';
import * as z from 'zod/v4';
import { SearchContainer } from '~/app';
import i18n from '~/app/i18n.ts';
import { UpdateUserForm, UsersTable } from '~/entities';
import { usersOptions, usersSortingFields } from '~/features';

const searchSchema = z.object({
  page: z.number().min(1).catch(1),
  limit: z.number().min(1).max(100).catch(10),
  sort: z.enum(usersSortingFields).catch('firstName'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const Route = createFileRoute('/_mainLayout/users/')({
  head: () => ({ meta: [{ title: i18n.t('Employees') }] }),
  validateSearch: searchSchema,
  component: RouteComponent,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(usersOptions());
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const nav = Route.useNavigate();

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
