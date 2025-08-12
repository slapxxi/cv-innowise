import { MenuItem, TableRow } from '@mui/material';
import { getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { usePositions } from '~/features/positions';
import { type ChangeSortHandler } from '~/shared/types';
import { ActionMenu, Highlight, OptionalLabel, PageTitle, SearchField, Table, TableCell } from '~/shared/ui';

const routeApi = getRouteApi('/_mainLayout/positions');

export function PositionsPage() {
  const { t } = useTranslation();
  const search = routeApi.useSearch();
  const nav = routeApi.useNavigate();
  const { positions } = usePositions({ ...search });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const fd = new FormData(form);
    const q = fd.get('query');
    nav({ search: (prev) => ({ ...prev, q }) });
    e.preventDefault();
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, sort, order }) });
  };

  return (
    <section className="flex flex-col gap-4 p-6 py-4">
      <header className="sticky top-4 z-10 flex flex-col gap-2 bg-bg dark:bg-bg-dark">
        <PageTitle>{t('Positions')}</PageTitle>

        <form onSubmit={handleSearch} key={search.q}>
          <SearchField placeholder={t('Search')} defaultValue={search.q} name="query" autoFocus={search.q !== ''} />
        </form>
      </header>

      <Table
        data={positions}
        headFields={[
          { id: 'name', title: t('Position name') },
          { id: 'action', title: '' },
        ]}
        order={search.order}
        sort={search.sort}
        onChangeSort={handleChangeSort}
        fixedHeight
      >
        {(position) => (
          <TableRow key={position.id}>
            <TableCell>
              <Highlight value={position.highlights.name}>
                <OptionalLabel>{position.name}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <ActionMenu>
                <MenuItem>Update position </MenuItem>
                <MenuItem>Delete position</MenuItem>
              </ActionMenu>
            </TableCell>
          </TableRow>
        )}
      </Table>
    </section>
  );
}
