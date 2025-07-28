import { MenuItem } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { SearchContainer } from '~/app';
import { AddCvForm, cvsOptions, cvsSortingFields, useCvs } from '~/features';
import {
  Modal,
  ActionMenu,
  ButtonAdd,
  type ChangeSortHandler,
  Highlight,
  OptionalLabel,
  Table,
  TableCell,
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
  const { cvs, invalidateCvs } = useCvs({ ...search });
  const [open, setOpen] = useState(false);

  const handleSearch = (q: string) => {
    nav({ search: (prev) => ({ ...prev, q }) });
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, sort, order }) });
  };

  function handleCreateCv() {
    invalidateCvs();
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
  }

  function handleCancel() {
    setOpen(false);
  }

  return (
    <SearchContainer
      title={t('Cvs')}
      query={search.q}
      onSearch={handleSearch}
      actionSlot={<ButtonAdd onClick={handleOpen}>{t('Create cv')}</ButtonAdd>}
    >
      <Modal title={t('Create cv')} open={open} onClose={handleCancel}>
        <AddCvForm onSuccess={handleCreateCv} onCancel={handleCancel} />
      </Modal>

      <Table
        data={cvs}
        headFields={[
          { id: 'name', title: t('Cv name') },
          { id: 'description', title: t('Cv description') },
          { id: 'education', title: t('Cv education') },
          { id: 'employee', title: t('Employee') },
          { id: 'action', title: '' },
        ]}
        order={search.order}
        sort={search.sort}
        onChangeSort={handleChangeSort}
        fixedHeight
      >
        {(cv) => (
          <>
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
            <TableCell>
              <ActionMenu>
                <MenuItem>Update cv </MenuItem>
                <MenuItem>Delete cv</MenuItem>
              </ActionMenu>
            </TableCell>
          </>
        )}
      </Table>
    </SearchContainer>
  );
}
