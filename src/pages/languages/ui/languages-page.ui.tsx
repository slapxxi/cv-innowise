import { MenuItem, TableRow } from '@mui/material';
import { getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useLanguages } from '~/features/languages';
import type { ChangeSortHandler } from '~/shared/types';
import { ActionMenu, Highlight, OptionalLabel, PageTitle, SearchField, Table, TableCell } from '~/shared/ui';

const routeApi = getRouteApi('/_mainLayout/languages');

export function LanguagesPage() {
  const { t } = useTranslation();
  const search = routeApi.useSearch();
  const nav = routeApi.useNavigate();
  const { languages } = useLanguages({ ...search });

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
        <PageTitle>{t('Languages')}</PageTitle>

        <form onSubmit={handleSearch} key={search.q}>
          <SearchField placeholder={t('Search')} defaultValue={search.q} name="query" autoFocus={search.q !== ''} />
        </form>
      </header>

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
    </section>
  );
}
