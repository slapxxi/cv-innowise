import { MenuItem } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { languagesOptions, languagesSortingFields, useLanguages } from '~/features';
import {
  ActionMenu,
  Highlight,
  OptionalLabel,
  PageTitle,
  SearchField,
  Table,
  TableCell,
  type TableField,
  switchOrder,
} from '~/shared';

const languagesSearchSchema = z.object({
  sort: z.enum(languagesSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const Route = createFileRoute('/_mainLayout/languages')({
  component: RouteComponent,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(languagesOptions({ accessToken: context.auth!.accessToken }));
  },
  validateSearch: languagesSearchSchema,
});

function RouteComponent() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  const { languages } = useLanguages({ ...search });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const fd = new FormData(form);
    const q = fd.get('query');
    nav({ search: (prev) => ({ ...prev, q }) });
    e.preventDefault();
  };

  function handleChangeSort(item: TableField) {
    nav({
      search: (prev) => ({
        ...prev,
        sort: item.id,
        order: item.id === prev.sort ? switchOrder(prev.order) : prev.order,
      }),
    });
  }

  return (
    <section className="flex flex-col gap-4 p-6 py-4">
      <header className="sticky top-4 z-10 flex flex-col gap-2 bg-bg dark:bg-bg-dark">
        <PageTitle>{t('Skills')}</PageTitle>

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
          <>
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
          </>
        )}
      </Table>
    </section>
  );
}
