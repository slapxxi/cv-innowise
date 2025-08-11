import { Chip, MenuItem } from '@mui/material';
import { Fragment, useState } from 'react';
import type { NonUndefined } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCvProjects, type CvProjectsSearchParams, type CvProjectsSortKey, type UsersSearchParams } from '~/features';
import { ActionMenu, cn, Highlight, OptionalLabel, Table, TableCell, TableRow, Text, type CvProject } from '~/shared';

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
