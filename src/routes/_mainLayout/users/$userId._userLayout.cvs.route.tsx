import { createFileRoute } from '@tanstack/react-router';
import * as z from 'zod/v4';
import { useAuth } from '~/app';
import { CvsPage } from '~/entities';
import { cvsOptions, cvsSortingFields, useCvs } from '~/features';
import { mergeBreadcrumbs, type ChangeSortHandler } from '~/shared';

const cvsSearchSchema = z.object({
  sort: z.enum(cvsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/cvs')({
  component: RouteComponent,
  beforeLoad: ({ context, search }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Cvs', to: '/users/$userId/cvs', props: { search } }),
    };
  },
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(cvsOptions());
  },
  validateSearch: cvsSearchSchema,
});

function RouteComponent() {
  const search = Route.useSearch();
  const params = Route.useParams();
  const nav = Route.useNavigate();
  const auth = useAuth();
  const { cvs } = useCvs({ userId: params.userId, ...search });

  const isOwner = params.userId === auth.user!.id;

  const handleSearch = (q: string) => {
    nav({ search: (prev) => ({ ...prev, q }) });
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, sort, order }) });
  };

  return (
    <CvsPage
      admin={isOwner}
      cvs={cvs}
      q={search.q}
      sort={search.sort}
      order={search.order}
      onSearch={handleSearch}
      onChangeSort={handleChangeSort}
    />
  );
}
