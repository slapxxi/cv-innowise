import { useTranslation } from 'react-i18next';
import { SearchContainer } from '~/app';
import { AddCvForm, UpdateCvForm, useCvs, useDeleteCvs, type CvsSortKey } from '~/features';
import { ButtonAdd, Confirm, Modal, useEditingState, type ChangeSortHandler, type Cv, type SortOrder } from '~/shared';
import { CvsTable } from '~/entities';

type CvsPageProps = {
  cvs: ReturnType<typeof useCvs>['cvs'];
  q: string;
  sort: CvsSortKey;
  order: SortOrder;
  onSearch: (q: string) => void;
  onChangeSort: ChangeSortHandler;
  admin?: boolean;
};

export const CvsPage: React.FC<CvsPageProps> = (props) => {
  const { admin = false, cvs, q, sort, order, onSearch, onChangeSort } = props;
  const { t } = useTranslation();
  const { invalidateCvs } = useCvs({});
  const { state, add, update, del, cancel } = useEditingState<{ cv: Cv }>();
  const { deleteCvs } = useDeleteCvs({
    onSuccess: () => {
      invalidateCvs();
      cancel();
    },
  });

  const handleSearch = (q: string) => {
    onSearch?.(q);
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    onChangeSort?.(sort, order);
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
      query={q}
      onSearch={handleSearch}
      actionSlot={admin && <ButtonAdd onClick={handleOpen}>{t('Create cv')}</ButtonAdd>}
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
        cvs={cvs}
        sort={sort}
        order={order}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onChangeSort={handleChangeSort}
      />
    </SearchContainer>
  );
};
