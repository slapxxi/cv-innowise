import { CloudUploadOutlined as CloudIcon } from '@mui/icons-material';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { SearchContainer } from '~/app';
import { AddCvForm, cvsOptions, cvsSortingFields, UpdateCvForm, useCvs, useDeleteCvs } from '~/features';
import {
  ActionMenu,
  ActionMenuItem,
  ButtonAdd,
  Confirm,
  Highlight,
  Modal,
  OptionalLabel,
  Table,
  TableCell,
  TableRow,
  useEditingState,
  type ChangeSortHandler,
  type Cv,
} from '~/shared';

const cvsSearchSchema = z.object({
  sort: z.enum(cvsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const Route = createFileRoute('/_mainLayout/cvs')({
  component: RouteComponent,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(cvsOptions({ accessToken: context.auth!.accessToken }));
  },
  validateSearch: cvsSearchSchema,
});

function RouteComponent() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  const { cvs, invalidateCvs, isFetching } = useCvs({ ...search });
  const { state, add, update, del, cancel } = useEditingState<{ cv: Cv }>();
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const { deleteCvs } = useDeleteCvs({
    onSuccess: () => {
      invalidateCvs();
      cancel();
    },
  });

  const handleSearch = (q: string) => {
    nav({ search: (prev) => ({ ...prev, q }) });
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, sort, order }) });
  };

  function handleCreateCv() {
    invalidateCvs();
    cancel();
  }

  function handleUpdateCv() {
    invalidateCvs();
    cancel();
  }

  function handleDeleteCv() {
    deleteCvs({ cvId: state.context!.cv.id });
  }

  function handleOpen() {
    add();
  }

  function handleCancel() {
    cancel();
  }

  function handleUpdate(cv: Cv) {
    update({ cv });
    setMenuOpen(null);
  }

  function handleDelete(cv: Cv) {
    del({ cv });
    setMenuOpen(null);
  }

  return (
    <SearchContainer
      title={t('Cvs')}
      query={search.q}
      onSearch={handleSearch}
      actionSlot={<ButtonAdd onClick={handleOpen}>{t('Create cv')}</ButtonAdd>}
    >
      <Confirm title="Delete CV" open={state.status === 'deleting'} onCancel={handleCancel} onConfirm={handleDeleteCv}>
        {`${t('Are you sure you want to delete CV')}`}
        <b>{` "${state.context?.cv.name}"`}?</b>
      </Confirm>

      <Modal title={t('Create cv')} open={state.status === 'adding'} onClose={handleCancel}>
        <AddCvForm onSuccess={handleCreateCv} onCancel={handleCancel} />
      </Modal>

      <Modal title={t('Update cv')} open={state.status === 'updating'} onClose={handleCancel}>
        {state.status === 'updating' && (
          <UpdateCvForm cv={state.context!.cv} onSuccess={handleUpdateCv} onCancel={handleCancel} />
        )}
      </Modal>

      <Table
        data={cvs}
        headFields={[
          { id: 'name', title: t('Cv name') },
          { id: 'description', title: t('Cv description') },
          { id: 'education', title: t('Cv education') },
          { id: 'employee', title: t('Employee') },
          { id: 'action', title: '', child: isFetching ? <CloudIcon className="text-xl text-neutral-300" /> : null },
        ]}
        order={search.order}
        sort={search.sort}
        onChangeSort={handleChangeSort}
        fixedHeight
      >
        {(cv, i) => (
          <TableRow key={cv.id}>
            <TableCell>
              <Highlight value={cv.highlights.name}>
                <OptionalLabel>{cv.name}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={cv.highlights.description}>
                <OptionalLabel>{cv.description}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={cv.highlights.education}>
                <OptionalLabel>{cv.education}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={cv.highlights.userEmail}>
                <OptionalLabel>{cv.user?.email}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell align="center">
              <ActionMenu open={menuOpen === i} onOpen={() => setMenuOpen(i)} onClose={() => setMenuOpen(null)}>
                <ActionMenuItem onClick={() => handleUpdate(cv)}>Update cv </ActionMenuItem>
                <ActionMenuItem onClick={() => handleDelete(cv)}>Delete cv</ActionMenuItem>
              </ActionMenu>
            </TableCell>
          </TableRow>
        )}
      </Table>
    </SearchContainer>
  );
}
