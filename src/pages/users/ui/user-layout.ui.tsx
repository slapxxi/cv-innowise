import { getRouteApi, Outlet, useMatches } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, TabLink, Tabs } from '~/shared/ui';

const routeApi = getRouteApi('/_mainLayout/users/$userId/_userLayout');

export function UserLayout() {
  const { t } = useTranslation();
  const params = routeApi.useParams();
  const matches = useMatches();

  return (
    <div>
      <header className="sticky top-0 z-10 flex flex-col gap-1 bg-bg px-6 py-4 xl:px-0 dark:bg-bg-dark">
        <Breadcrumbs className="mb-4 pl-4" />

        <Tabs value={matches.at(-1)?.fullPath ?? ''}>
          <TabLink
            to="/users/$userId/profile"
            params={{ userId: params.userId }}
            value="/users/$userId/profile"
            label={t('Profile')}
            replace
          />
          <TabLink
            to="/users/$userId/skills"
            params={{ userId: params.userId }}
            value="/users/$userId/skills"
            label={t('Skills')}
            replace
          />
          <TabLink
            to="/users/$userId/languages"
            params={{ userId: params.userId }}
            value="/users/$userId/languages"
            label={t('Languages')}
            replace
          />
          <TabLink
            to="/users/$userId/cvs"
            params={{ userId: params.userId }}
            value="/users/$userId/cvs"
            label={t('Cvs')}
            search={{ order: 'name', sort: 'asc', q: '' }}
            replace
          />
        </Tabs>
      </header>

      <Outlet />
    </div>
  );
}
