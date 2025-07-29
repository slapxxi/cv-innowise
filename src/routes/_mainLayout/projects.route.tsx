import { Chip, MenuItem } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { SearchContainer } from '~/app';
import { projectsOptions, projectsSortingFields, useProjects, type ProjectsSortKey } from '~/features';
import {
  ActionMenu,
  ButtonAdd,
  cn,
  Highlight,
  OptionalLabel,
  Table,
  TableCell,
  TableRow,
  Text,
  type ChangeSortHandler,
} from '~/shared';

const projectsSearchSchema = z.object({
  sort: z.enum(projectsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const Route = createFileRoute('/_mainLayout/projects')({
  component: RouteComponent,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(projectsOptions({ accessToken: context.auth!.accessToken }));
  },
  validateSearch: projectsSearchSchema,
});

function RouteComponent() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  const { projects } = useProjects({ ...search });

  const handleSearch = (q: string) => {
    nav({ search: (prev) => ({ ...prev, q }) });
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, sort, order }) });
  };

  return (
    <SearchContainer
      title={t('Projects')}
      query={search.q}
      onSearch={handleSearch}
      actionSlot={<ButtonAdd>{t('Add project')}</ButtonAdd>}
    >
      <Table
        data={projects}
        headFields={
          [
            { id: 'name', title: t('Project name') },
            { id: 'internalName', title: t('Internal name') },
            { id: 'domain', title: t('Domain') },
            { id: 'startDate', title: t('Start date') },
            { id: 'endDate', title: t('End date') },
            { id: 'action', title: '' },
          ] satisfies Array<{ id: ProjectsSortKey | 'action'; title: string }>
        }
        order={search.order}
        sort={search.sort}
        onChangeSort={handleChangeSort}
        fixedHeight
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
              <TableCell colSpan={6} className={cn('py-8', project.environment.length !== 0 && 'border-b-0')}>
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
                  {project.environment.map((env) => (
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
