import { MenuItem, TableRow } from '@mui/material';
import { getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useLanguages } from '~/features/languages';
import type { ChangeSortHandler } from '~/shared/types';
import { ActionMenu, Highlight, OptionalLabel, SearchContainer, Table, TableCell } from '~/shared/ui';

const routeApi = getRouteApi('/_mainLayout/languages');

export function LanguagesPage() {
  const { t } = useTranslation();
  const search = routeApi.useSearch();
  const nav = routeApi.useNavigate();
  const { languages } = useLanguages({ ...search });

  const handleSearch = (q: string) => {
    nav({ search: (prev) => ({ ...prev, q }) });
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, sort, order }) });
  };

  return (
    <SearchContainer title={t('Positions')} query={search.q} onSearch={handleSearch}>
      <Table
        data={languages}
        headFields={[
          { id: 'name', title: t('Language name') },
          { id: 'nativeName', title: t('Native name') },
          { id: 'iso2', title: t('iso2') },
          { id: 'action', title: '' },
        ]}
        order={search.order}
        sort={search.sort}
        onChangeSort={handleChangeSort}
        fixedHeight
      >
        {(lang) => (
          <TableRow key={lang.id}>
            <TableCell>
              <Highlight value={lang.highlights.name}>
                <OptionalLabel>{lang.name}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={lang.highlights.nativeName}>
                <OptionalLabel>{lang.nativeName}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={lang.highlights.iso2}>
                <OptionalLabel>{lang.iso2}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <ActionMenu>
                <MenuItem>Update language </MenuItem>
                <MenuItem>Delete language</MenuItem>
              </ActionMenu>
            </TableCell>
          </TableRow>
        )}
      </Table>
    </SearchContainer>
  );
}
