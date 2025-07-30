import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import z from 'zod/v4';
import { SearchContainer } from '~/app';
import { CvProjectsTable } from '~/entities';
import {
  AddCvProjectForm,
  cvProjectsSortingFields,
  projectsOptions,
  UpdateCvProjectForm,
  useCvProjects,
  useDeleteCvProject,
} from '~/features';
import {
  ButtonAdd,
  Confirm,
  mergeBreadcrumbs,
  Modal,
  useEditingState,
  type ChangeSortHandler,
  type CvProject,
} from '~/shared';

const projectsSearchSchema = z.object({
  sort: z.enum(cvProjectsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout/projects')({
  component: RouteComponent,
  beforeLoad: ({ context, search }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, {
        title: 'Projects',
        to: '/cvs/$cvId/projects',
        props: { search },
      }),
    };
  },
  loader: ({ context }) => {
    const { auth, queryClient } = context;
    queryClient.prefetchQuery(projectsOptions({ accessToken: auth!.accessToken }));
  },
  validateSearch: projectsSearchSchema,
});

function RouteComponent() {
  const { t } = useTranslation();
  const params = Route.useParams();
  const search = Route.useSearch();
  const nav = Route.useNavigate();
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
