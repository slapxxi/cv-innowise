import { Tab, Tabs } from '@mui/material';
import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import { identity } from 'lodash';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';

const authSearchSchema = z.object({ redirect: z.string().catch('/') });

export const Route = createFileRoute('/auth/_authLayout')({
  component: RouteComponent,
  validateSearch: authSearchSchema,
});

function RouteComponent() {
  const { t } = useTranslation();
  const location = useLocation();
  const nav = Route.useNavigate();

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    nav({ to: `/auth/${newValue}`, search: identity });
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex justify-center">
        <Tabs value={location.pathname.split('/')[2]} onChange={handleChangeTab}>
          <Tab label={t('Login tab')} value="login"></Tab>
          <Tab label={t('Signup tab')} value="signup"></Tab>
        </Tabs>
      </header>

      <div className="mx-auto my-auto w-full max-w-xl">
        <Outlet />
      </div>
    </div>
  );
}
