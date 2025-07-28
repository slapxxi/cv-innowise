import { MenuItem } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { SearchContainer } from '~/app';
import { cvsOptions, cvsSortingFields, useCvs } from '~/features';
import { ActionMenu, ButtonAdd, type ChangeSortHandler, Highlight, OptionalLabel, Table, TableCell } from '~/shared';

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
  const { cvs } = useCvs({ ...search });

  const handleSearch = (q: string) => {
    nav({ search: (prev) => ({ ...prev, q }) });
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, sort, order }) });
  };

  return (
    <SearchContainer
      title={t('Cvs')}
      query={search.q}
      onSearch={handleSearch}
      actionSlot={<ButtonAdd>{t('Create cv')}</ButtonAdd>}
    >
      <Table
        data={cvs}
        headFields={[
          { id: 'name', title: t('Cv name') },
          { id: 'description', title: t('Cv description') },
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
