import { createFileRoute } from '@tanstack/react-router';
import * as z from 'zod/v4';
import { CvsPage } from '~/entities';
import { cvsOptions, cvsSortingFields, useCvs } from '~/features';
import { type ChangeSortHandler } from '~/shared';

const cvsSearchSchema = z.object({
  sort: z.enum(cvsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const Route = createFileRoute('/_mainLayout/cvs/')({
  component: RouteComponent,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(cvsOptions({ accessToken: context.auth.accessToken! }));
  },
  validateSearch: cvsSearchSchema,
});

function RouteComponent() {
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
    <CvsPage
      admin
      cvs={cvs}
      q={search.q}
      sort={search.sort}
      order={search.order}
      onSearch={handleSearch}
      onChangeSort={handleChangeSort}
    />
  );
}
