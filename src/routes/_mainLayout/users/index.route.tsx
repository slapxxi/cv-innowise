import { ChevronRight as ChevronRightIcon, MoreVert as DotsIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import { throttle } from 'lodash';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { useAuth } from '~/app';
import i18n from '~/app/i18n.ts';
import { usersOptions, useUsers } from '~/features';
import {
  PageTitle,
  SearchField,
  sliceCollection,
  Table,
  TableCell,
  UserAvatar,
  type TableField,
  type User,
} from '~/shared';

i18n.changeLanguage('ru');

const sortingFields = ['firstName', 'lastName', 'email', 'postion', 'department'] as const;

const searchSchema = z.object({
  page: z.number().min(1).catch(1),
  limit: z.number().min(1).max(100).catch(5),
  sort: z.enum(sortingFields).catch('firstName'),
  order: z.enum(['asc', 'desc']).catch('desc'),
  q: z.string().trim().catch(''),
});

function mapSortToProperty(sort: (typeof sortingFields)[number]) {
  return (user: User) => {
    let result;

    switch (sort) {
      case 'firstName':
        result = user.profile.firstName;
        break;
      case 'lastName':
        result = user.profile.lastName;
        break;
      case 'email':
        result = user.email;
        break;
      case 'postion':
        result = user.positionName;
        break;
      case 'department':
        result = user.departmentName;
        break;
    }

    return result?.toLowerCase() ?? '';
  };
}

export const Route = createFileRoute('/_mainLayout/users/')({
  head: () => ({ meta: [{ title: i18n.t('Employees') }] }),
  validateSearch: searchSchema,
  component: RouteComponent,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(usersOptions({ accessToken: context.auth!.accessToken }));
  },
});

const process = throttle((nav, search, q) => {
  nav({ search: { ...search, q } });
}, 500);

function switchOrder(order: 'asc' | 'desc') {
  return order === 'asc' ? 'desc' : 'asc';
}

function createCompareFn(sort: (typeof sortingFields)[number], order: 'asc' | 'desc') {
  const getValue = mapSortToProperty(sort);
  const isAsc = order === 'asc';

  return (a: User, b: User) => {
    const valA = getValue(a);
    const valB = getValue(b);

    if (valA < valB) return isAsc ? -1 : 1;
    if (valA > valB) return isAsc ? 1 : -1;

    return 0;
  };
}

function RouteComponent() {
  const { t } = useTranslation();
  const { users } = useUsers();
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  const auth = useAuth();

  const sortedUsers = [...users].sort(createCompareFn(search.sort, search.order));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = e.currentTarget;
    process(nav, search, s.value);
  };

  function handleChangeSort(item: TableField) {
    nav({
      search: (prev) => ({
        ...prev,
        page: 1,
        sort: item.id,
        order: item.id === prev.sort ? switchOrder(prev.order) : prev.order,
      }),
    });
  }

  function handleChangePage(page: number) {
    nav({ search: (prev) => ({ ...prev, page: page + 1 }) });
  }

  function handleChangeRowsPerPage(rows: number) {
    nav({ search: (prev) => ({ ...prev, limit: rows, page: 1 }) });
  }

  return (
    <section className="flex flex-col p-6 py-4">
      <header className="flex flex-col gap-2">
        <PageTitle>{t('Employees')}</PageTitle>

        <form>
          <SearchField placeholder={t('Search')} name="q" onChange={handleSearch} />
        </form>
      </header>

      <Table
        headFields={[
          { id: 'avatar', title: '' },
          { id: 'firstName', title: t('First Name') },
          { id: 'lastName', title: t('Last Name') },
          { id: 'email', title: t('Email') },
          { id: 'department', title: t('Department') },
          { id: 'position', title: t('Position') },
          { id: 'action', title: '' },
        ]}
        data={sliceCollection(sortedUsers, { page: search.page, limit: search.limit })}
        count={users.length}
        order={search.order}
        sort={search.sort}
        page={search.page}
        limit={search.limit}
        onChangePage={handleChangePage}
        onChangeSort={handleChangeSort}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      >
        {(user) => (
          <>
            <TableCell>
              <Link to="/users/$userId/profile" params={{ userId: user.id }}>
                <UserAvatar user={user} />
              </Link>
            </TableCell>
            <TableCell>
              <OptionalLabel>{user.profile.firstName}</OptionalLabel>
            </TableCell>
            <TableCell>
              <OptionalLabel>{user.profile.lastName}</OptionalLabel>
            </TableCell>
            <TableCell>
              <OptionalLabel>{user.email}</OptionalLabel>
            </TableCell>
            <TableCell>
              <OptionalLabel>{user.departmentName}</OptionalLabel>
            </TableCell>
            <TableCell>
              <OptionalLabel>{user.positionName}</OptionalLabel>
            </TableCell>
            <TableCell>
              <IconButton>{auth!.user.id === user.id ? <DotsIcon /> : <ChevronRightIcon />}</IconButton>
            </TableCell>
          </>
        )}
      </Table>
    </section>
  );
}

type OptionalFieldProps = { children?: React.ReactNode };

export const OptionalLabel: React.FC<OptionalFieldProps> = (props) => {
  const { children } = props;

  if (children) {
    return <>{children}</>;
  }

  return <div className="italic text-neutral-400 text-sm">Not Specified</div>;
};
