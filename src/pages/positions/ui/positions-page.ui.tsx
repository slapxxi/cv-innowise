import { MenuItem, TableRow } from '@mui/material';
import { getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { usePositions } from '~/features/positions';
import { type ChangeSortHandler } from '~/shared/types';
import { ActionMenu, Highlight, OptionalLabel, SearchContainer, Table, TableCell } from '~/shared/ui';

const routeApi = getRouteApi('/_mainLayout/positions');

export function PositionsPage() {
  const { t } = useTranslation();
  const search = routeApi.useSearch();
  const nav = routeApi.useNavigate();
  const { positions } = usePositions({ ...search });

  const handleSearch = (q: string) => {
    nav({ search: (prev) => ({ ...prev, q }) });
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, sort, order }) });
  };

  return (
    <SearchContainer title={t('Positions')} query={search.q} onSearch={handleSearch}>
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
    </SearchContainer>
  );
}
