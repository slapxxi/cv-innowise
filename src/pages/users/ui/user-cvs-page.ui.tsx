import { getRouteApi } from '@tanstack/react-router';
import { useCvs } from '~/features/cvs';
import { useAuth } from '~/shared/hooks';
import type { ChangeSortHandler } from '~/shared/types';
import { CvsPage } from '.';

const routeApi = getRouteApi('/_mainLayout/users/$userId/_userLayout/cvs');

export function UserCvsPage() {
  const search = routeApi.useSearch();
  const params = routeApi.useParams();
  const nav = routeApi.useNavigate();
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
