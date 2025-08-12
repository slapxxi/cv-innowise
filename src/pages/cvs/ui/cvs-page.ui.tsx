import { getRouteApi } from '@tanstack/react-router';
import { CvsPageContainer, useCvs } from '~/features/cvs';
import { type ChangeSortHandler } from '~/shared/types';

const routeApi = getRouteApi('/_mainLayout/cvs/');

export function CvsPage() {
  const search = routeApi.useSearch();
  const nav = routeApi.useNavigate();
  const { cvs } = useCvs({ ...search });

  const handleSearch = (q: string) => {
    nav({ search: (prev) => ({ ...prev, q }) });
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, sort, order }) });
  };

  return (
    <CvsPageContainer
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
