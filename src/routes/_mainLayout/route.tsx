import { Group, TrendingUp, ContactPageOutlined } from '@mui/icons-material';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from '~/shared';

export const Route = createFileRoute('/_mainLayout')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <aside className="fixed bottom-0 w-full bg-white dark:bg-neutral-700">
        <nav>
          <ul className="flex justify-between gap-1 px-4 py-2">
            {[
              { to: '/users', name: 'Employees', Icon: Group },
              { to: '/skills', name: 'Skills', Icon: TrendingUp },
              { to: '/languages', name: 'Languages', Icon: TrendingUp },
            ].map(({ to, name, Icon }) => (
              <li key={to} className="flex">
                <Link
                  activeOptions={{ exact: true }}
                  to={to}
                  activeProps={{
                    className:
                      'text-neutral-800 bg-neutral-200 hover:bg-neutral-200 hover:text-neutral-800 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-600 dark:hover:text-white',
                  }}
                  className="flex items-center gap-4 rounded-full px-6 py-3 text-base text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 dark:hover:text-white"
                >
                  <Icon />
                  {t(name)}
                </Link>
              </li>
            ))}
            <li className="flex">
              <Link
                activeOptions={{ exact: true }}
                to="/cvs"
                activeProps={{
                  className:
                    'text-neutral-800 bg-neutral-200 hover:bg-neutral-200 hover:text-neutral-800 dark:bg-neutral-600 dark:text-white',
                }}
                className="hidden items-center gap-4 rounded-full px-6 py-3 text-base text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700 md:flex"
              >
                <ContactPageOutlined />
                {t('CVs')}
              </Link>
            </li>
            <li className="overflow-hidden">
              <Link
                to="/users/$userId/profile"
                params={{ userId: '1' }}
                className="flex items-center gap-4 rounded-full p-1 pr-6 text-base hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-600 dark:hover:text-white"
              >
                <UserAvatar className="size-10 bg-primary text-white dark:text-neutral-600">H</UserAvatar>
                <span className="overflow-hidden text-nowrap text-ellipsis">Rostislav Bobrov</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <Outlet />
    </div>
  );
}
