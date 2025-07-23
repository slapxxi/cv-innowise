import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router';
import { identity } from 'lodash';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { TabLink, Tabs } from '~/shared';

const authSearchSchema = z.object({ redirect: z.string().catch('/') });

export const Route = createFileRoute('/auth/_authLayout')({
  component: RouteComponent,
  validateSearch: authSearchSchema,
});

function RouteComponent() {
  const { t } = useTranslation();
  const matches = useMatches();

  return (
    <div className="flex h-screen flex-col">
      <header className="flex justify-center">
        <Tabs value={matches.at(-1)?.fullPath ?? ''}>
          <TabLink to="/auth/login" value="/auth/login" label={t('Login tab')} search={identity} />
          <TabLink to="/auth/signup" value="/auth/signup" label={t('Signup tab')} search={identity} />
        </Tabs>
      </header>

      <div className="mx-auto my-auto w-full max-w-xl">
        <Outlet />
      </div>
    </div>
  );
}
