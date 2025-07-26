import { ChevronRight as ChevronRightIcon, MoreVert as DotsIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import fuzzysort from 'fuzzysort';
import { throttle } from 'lodash';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { useAuth } from '~/app';
import i18n from '~/app/i18n.ts';
import { usersOptions, useUsers } from '~/features';
import {
  IconButtonLink,
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

const commitSearch = throttle((nav: ReturnType<typeof Route.useNavigate>, q: string) => {
  nav({ search: (prev) => ({ ...prev, q, page: 1 }) });
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

    if (typeof valA === 'string' && typeof valB === 'string') {
      const comparison = valA.localeCompare(valB);
      return isAsc ? comparison : -comparison;
    }

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

  const searchResults = fuzzysort.go(search.q, users, {
    threshold: 0,
    keys: ['email', 'profile.firstName', 'profile.lastName', 'departmentName', 'positionName'],
    all: true,
  });

  const searchedUsers = searchResults.map((result) => {
    const [email, firstName, lastName, department, position] = result;

    return {
      ...result.obj,
      highlights: {
        email: email.highlight(),
        firstName: firstName.highlight(),
        lastName: lastName.highlight(),
        departmentName: department.highlight(),
        positionName: position.highlight(),
      },
    };
  });

  const sortedUsers = [...searchedUsers].sort(createCompareFn(search.sort, search.order));

  const filteredUsers = sortedUsers;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const fd = new FormData(form);
    const q = fd.get('query');
    commitSearch(nav, q as string);
    e.preventDefault();
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

        <form onSubmit={handleSearch} key={search.q}>
          <SearchField placeholder={t('Search')} defaultValue={search.q} name="query" />
        </form>
      </header>

      <Table
        data={sliceCollection(filteredUsers, { page: search.page, limit: search.limit })}
        headFields={[
          { id: 'avatar', title: '' },
          { id: 'firstName', title: t('First Name') },
          { id: 'lastName', title: t('Last Name') },
          { id: 'email', title: t('Email') },
          { id: 'department', title: t('Department') },
          { id: 'position', title: t('Position') },
          { id: 'action', title: '' },
        ]}
        count={filteredUsers.length}
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
                <UserAvatar user={user} className="hover:opacity-55" />
              </Link>
            </TableCell>
            <TableCell>
              <Highlight value={user.highlights.firstName}>
                <OptionalLabel>{user.profile.firstName}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={user.highlights.lastName}>
                <OptionalLabel>{user.profile.lastName}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={user.highlights.email}>
                <OptionalLabel>{user.email}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={user.highlights.departmentName}>
                <OptionalLabel>{user.departmentName}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={user.highlights.positionName}>
                <OptionalLabel>{user.positionName}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              {auth!.user.id === user.id ? (
                <IconButton className="hover:opacity-55">
                  {auth!.user.id === user.id ? <DotsIcon /> : <ChevronRightIcon />}
                </IconButton>
              ) : (
                <IconButtonLink to="/users/$userId/profile" params={{ userId: user.id }} className="hover:opacity-55">
                  <ChevronRightIcon />
                </IconButtonLink>
              )}
            </TableCell>
          </>
        )}
      </Table>
    </section>
  );
}

type HighlightProps = { value?: string | null; children?: React.ReactNode };

export const Highlight: React.FC<HighlightProps> = (props) => {
  const { value, children } = props;

  if (value) {
    return (
      <span dangerouslySetInnerHTML={{ __html: value }} className="[&_b]:bg-yellow-400 [&_b]:p-0.5 [&_b]:rounded-xs" />
    );
  }

  return children;
};

type OptionalFieldProps = { children?: React.ReactNode };

export const OptionalLabel: React.FC<OptionalFieldProps> = (props) => {
  const { children } = props;

  if (children) {
    return children;
  }

  return <div className="italic text-neutral-400 text-sm">Not Specified</div>;
};
