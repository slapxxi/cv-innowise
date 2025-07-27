import { MenuItem } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { skillsOptions, skillsSortingFields, useSkills } from '~/features';
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

const skillsSearchSchema = z.object({
  sort: z.enum(skillsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const Route = createFileRoute('/_mainLayout/skills')({
  component: RouteComponent,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(skillsOptions({ accessToken: context.auth!.accessToken }));
  },
  validateSearch: skillsSearchSchema,
});

function RouteComponent() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  const { skills } = useSkills({ ...search });

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
          <SearchField placeholder={t('Search')} defaultValue={search.q} name="query" />
        </form>
      </header>

      <Table
        data={skills}
        headFields={[
          { id: 'name', title: 'Name' },
          { id: 'categoryName', title: 'Category' },
          { id: 'action', title: '' },
        ]}
        order={search.order}
        sort={search.sort}
        onChangeSort={handleChangeSort}
        fixedHeight
      >
        {(skill) => (
          <>
            <TableCell>
              <Highlight value={skill.highlights.name}>
                <OptionalLabel>{skill.name}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={skill.highlights.categoryName}>
                <OptionalLabel>{skill.categoryName}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <ActionMenu>
                <MenuItem>Update skill </MenuItem>
                <MenuItem>Delete skill</MenuItem>
              </ActionMenu>
            </TableCell>
          </>
        )}
      </Table>
    </section>
  );
}
