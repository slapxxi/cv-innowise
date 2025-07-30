import { Chip, MenuItem } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import z from 'zod/v4';
import { SearchContainer } from '~/app';
import {
  AddCvProjectForm,
  cvProjectsSortingFields,
  projectsOptions,
  useCvProjects,
  useDeleteCvProject,
  type CvProjectsSearchParams,
  type CvProjectsSortKey,
  type UsersSearchParams,
} from '~/features';
import {
  ActionMenu,
  ButtonAdd,
  cn,
  Confirm,
  Highlight,
  mergeBreadcrumbs,
  Modal,
  OptionalLabel,
  Table,
  TableCell,
  TableRow,
  Text,
  useEditingState,
  type ChangeSortHandler,
  type CvProject,
  type NonUndefined,
} from '~/shared';

const projectsSearchSchema = z.object({
  sort: z.enum(cvProjectsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout/projects')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, {
        title: 'Projects',
        to: '/cvs/$cvId/projects',
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

type CvProjectsTableProps = {
  cvId: string;
  q: NonUndefined<UsersSearchParams['q']>;
  sort: NonUndefined<CvProjectsSearchParams['sort']>;
  onUpdate?: (cvProject: CvProject) => void;
  onDelete?: (cvProject: CvProject) => void;
} & Omit<React.ComponentProps<typeof Table>, 'data' | 'children' | 'headFields' | 'count' | 'sort'>;

export const CvProjectsTable: React.FC<CvProjectsTableProps> = (props) => {
  const { cvId, q, sort, order, onUpdate, onDelete, onChangeSort, ...rest } = props;
  const { t } = useTranslation();
  const { cvProjects } = useCvProjects({ id: cvId, q, sort, order });
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const handleUpdate = (cvProject: CvProject) => {
    onUpdate?.(cvProject);
    setMenuOpen(null);
  };

  const handleDelete = (cvProject: CvProject) => {
    onDelete?.(cvProject);
    setMenuOpen(null);
  };

  return (
    <Table
      data={cvProjects}
      headFields={
        [
          { id: 'name', title: t('Project name') },
          { id: 'internalName', title: t('Internal name') },
          { id: 'domain', title: t('Domain') },
          { id: 'startDate', title: t('Start date') },
          { id: 'endDate', title: t('End date') },
          { id: 'action', title: '' },
        ] satisfies Array<{ id: CvProjectsSortKey | 'action'; title: string }>
      }
      order={order}
      sort={sort}
      onChangeSort={onChangeSort}
      {...rest}
    >
      {(cvProject, i) => (
        <Fragment key={cvProject.id}>
          <TableRow>
            <TableCell className="border-b-0">
              <Highlight value={cvProject.highlights.name}>
                <OptionalLabel>{cvProject.name}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell className="border-b-0">
              <Highlight value={cvProject.highlights.internalName}>
                <OptionalLabel>{cvProject.internalName}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell className="border-b-0">
              <Highlight value={cvProject.highlights.domain}>
                <OptionalLabel>{cvProject.domain}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell className="border-b-0">
              <Highlight value={cvProject.highlights.startDate}>
                <OptionalLabel>{cvProject.startDate}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell className="border-b-0">
              <Highlight value={cvProject.highlights.endDate}>
                <OptionalLabel text={t('Till now')}>{cvProject.endDate}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell className="border-b-0">
              <ActionMenu open={menuOpen === i} onOpen={() => setMenuOpen(i)} onClose={() => setMenuOpen(null)}>
                <MenuItem onClick={() => handleUpdate(cvProject)}>{t('Update project')}</MenuItem>
                <MenuItem onClick={() => handleDelete(cvProject)}>{t('Delete project')}</MenuItem>
              </ActionMenu>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6} className={cn('py-8', cvProject.environment?.length !== 0 && 'border-b-0')}>
              <Text variant="light" asChild>
                <Highlight value={cvProject.highlights.description}>
                  <OptionalLabel>{cvProject.description}</OptionalLabel>
                </Highlight>
              </Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6} className="py-8">
              <div className="flex gap-2 flex-wrap">
                {cvProject.environment?.map((env) => (
                  <Chip key={env} label={env} className="shrink-0" variant="outlined" />
                ))}
              </div>
            </TableCell>
          </TableRow>
        </Fragment>
      )}
    </Table>
  );
};
