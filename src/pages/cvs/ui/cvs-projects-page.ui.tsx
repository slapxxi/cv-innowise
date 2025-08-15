import { getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  AddCvProjectForm,
  UpdateCvProjectForm,
  useCvProjects,
  useDeleteCvProject,
  CvProjectsTable,
} from '~/features/cvs';
import { useEditingState } from '~/shared/hooks';
import { type ChangeSortHandler, type CvProject } from '~/shared/types';
import { ButtonAdd, Confirm, Modal, SearchContainer } from '~/shared/ui';

const routeApi = getRouteApi('/_mainLayout/cvs/$cvId/_cvsLayout/projects');

export function CvsProjectsPage() {
  const { t } = useTranslation();
  const params = routeApi.useParams();
  const search = routeApi.useSearch();
  const nav = routeApi.useNavigate();
  const { invalidateCvProjects } = useCvProjects({ id: params.cvId, ...search });
  const { state, add, update, del, cancel } = useEditingState<{ cvProject: CvProject }>();
  const { deleteCvProject } = useDeleteCvProject({
    onSuccess: () => {
      invalidateCvProjects();
      cancel();
    },
  });

  const handleSearch = (q: string) => {
    nav({ search: (prev) => ({ ...prev, q }) });
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, sort, order }) });
  };

  const handleDeleteCvProject = () => {
    if (state.context?.cvProject) {
      deleteCvProject({ cvId: params.cvId, projectId: state.context.cvProject.project.id });
    }
  };

  const handleAdd = () => {
    add();
  };

  const handleUpdate = (cvProject: CvProject) => {
    update({ cvProject });
  };

  const handleDel = (cvProject: CvProject) => {
    del({ cvProject });
  };

  const handleCancel = () => {
    cancel();
  };

  return (
    <SearchContainer
      query={search.q}
      onSearch={handleSearch}
      actionSlot={<ButtonAdd onClick={handleAdd}>{t('Add project')}</ButtonAdd>}
    >
      <Confirm
        title={t('Delete cv project')}
        open={state.status === 'deleting'}
        onCancel={handleCancel}
        onConfirm={handleDeleteCvProject}
      >
        {`${t('Are you sure you want to delete cv project')}`}
        <b>{` "${state.context?.cvProject.name}"`}?</b>
      </Confirm>

      <Modal open={state.status === 'adding'} title={t('Add cv project')} onClose={handleCancel} size="lg">
        <AddCvProjectForm
          onSuccess={() => {
            invalidateCvProjects();
            cancel();
          }}
          onCancel={handleCancel}
        />
      </Modal>

      <Modal open={state.status === 'updating'} title={t('Update cv project')} onClose={handleCancel} size="lg">
        {state.context?.cvProject && (
          <UpdateCvProjectForm
            cvProject={state.context.cvProject}
            onSuccess={() => {
              invalidateCvProjects();
              cancel();
            }}
            onCancel={handleCancel}
          />
        )}
      </Modal>

      <CvProjectsTable
        cvId={params.cvId}
        q={search.q}
        sort={search.sort}
        order={search.order}
        onUpdate={handleUpdate}
        onDelete={handleDel}
        onChangeSort={handleChangeSort}
      />
    </SearchContainer>
  );
}
