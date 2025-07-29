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
  type CvProjectsSortKey,
} from '~/features';
import {
  ActionMenu,
  ButtonAdd,
  cn,
  Highlight,
  mergeBreadcrumbs,
  Modal,
  OptionalLabel,
  Table,
  TableCell,
  TableRow,
  Text,
  type ChangeSortHandler,
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
  const { cvProjects, invalidateCvProjects } = useCvProjects({ id: params.cvId, ...search });
  const [open, setOpen] = useState(false);

  const handleSearch = (q: string) => {
    nav({ search: (prev) => ({ ...prev, q }) });
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, sort, order }) });
  };

  return (
    <SearchContainer
      query={search.q}
      onSearch={handleSearch}
      actionSlot={<ButtonAdd onClick={() => setOpen(true)}>{t('Add project')}</ButtonAdd>}
    >
      <Modal open={open} title={t('Add cv project')} onClose={() => setOpen(false)} size="lg">
        <AddCvProjectForm
          onSuccess={() => {
            invalidateCvProjects();
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </Modal>

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
        order={search.order}
        sort={search.sort}
        onChangeSort={handleChangeSort}
      >
        {(project) => (
          <Fragment key={project.id}>
            <TableRow>
              <TableCell className="border-b-0">
                <Highlight value={project.highlights.name}>
                  <OptionalLabel>{project.name}</OptionalLabel>
                </Highlight>
              </TableCell>
              <TableCell className="border-b-0">
                <Highlight value={project.highlights.internalName}>
                  <OptionalLabel>{project.internalName}</OptionalLabel>
                </Highlight>
              </TableCell>
              <TableCell className="border-b-0">
                <Highlight value={project.highlights.domain}>
                  <OptionalLabel>{project.domain}</OptionalLabel>
                </Highlight>
              </TableCell>
              <TableCell className="border-b-0">
                <Highlight value={project.highlights.startDate}>
                  <OptionalLabel>{project.startDate}</OptionalLabel>
                </Highlight>
              </TableCell>
              <TableCell className="border-b-0">
                <Highlight value={project.highlights.endDate}>
                  <OptionalLabel text={t('Till now')}>{project.endDate}</OptionalLabel>
                </Highlight>
              </TableCell>
              <TableCell className="border-b-0">
                <ActionMenu>
                  <MenuItem>{t('Update project')}</MenuItem>
                  <MenuItem>{t('Delete project')}</MenuItem>
                </ActionMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6} className={cn('py-8', project.environment?.length !== 0 && 'border-b-0')}>
                <Text variant="light" asChild>
                  <Highlight value={project.highlights.description}>
                    <OptionalLabel>{project.description}</OptionalLabel>
                  </Highlight>
                </Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6} className="py-8">
                <div className="flex gap-2 flex-wrap">
                  {project.environment?.map((env) => (
                    <Chip key={env} label={env} className="shrink-0" variant="outlined" />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          </Fragment>
        )}
      </Table>
    </SearchContainer>
  );
}
