import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { SearchContainer } from '~/app';
import { CvsTable } from '~/entities';
import { AddCvForm, cvsOptions, cvsSortingFields, UpdateCvForm, useCvs, useDeleteCvs } from '~/features';
import { ButtonAdd, Confirm, Modal, useEditingState, type ChangeSortHandler, type Cv } from '~/shared';

const cvsSearchSchema = z.object({
  sort: z.enum(cvsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const Route = createFileRoute('/_mainLayout/cvs/')({
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
  const { invalidateCvs } = useCvs({ ...search });
  const { state, add, update, del, cancel } = useEditingState<{ cv: Cv }>();
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
  }

  function handleDelete(cv: Cv) {
    del({ cv });
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
          <UpdateCvForm cv={state.context!.cv} onSuccess={handleUpdateCv} onCancel={handleCancel} animate={false} />
        )}
      </Modal>

      <CvsTable
        q={search.q}
        sort={search.sort}
        order={search.order}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onChangeSort={handleChangeSort}
      />
    </SearchContainer>
  );
}
