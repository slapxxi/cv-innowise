import { Chip, MenuItem } from '@mui/material';
import { getRouteApi } from '@tanstack/react-router';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useProjects, type ProjectsSortKey } from '~/features/projects';
import type { ChangeSortHandler } from '~/shared/types';
import {
  ActionMenu,
  ButtonAdd,
  Highlight,
  OptionalLabel,
  SearchContainer,
  Table,
  TableCell,
  TableRow,
  Text,
} from '~/shared/ui';
import { cn } from '~/shared/utils';

const routeApi = getRouteApi('/_mainLayout/projects');

export function ProjectsPage() {
  const { t } = useTranslation();
  const search = routeApi.useSearch();
  const nav = routeApi.useNavigate();
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
