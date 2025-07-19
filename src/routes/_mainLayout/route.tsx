import { ChevronLeft, ContactPageOutlined, Group, TrendingUp } from '@mui/icons-material';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from '~/shared';

export const Route = createFileRoute('/_mainLayout')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen xl:flex xl:gap-4">
      <aside className="fixed bottom-0 w-full bg-white xl:static xl:flex xl:w-[200px] xl:flex-col dark:bg-neutral-700">
        <nav className="xl:flex xl:flex-1 xl:flex-col">
          <ul className="flex justify-between gap-1 px-4 py-2 xl:flex-1 xl:flex-col xl:justify-start xl:gap-3 xl:p-0">
            {[
              { to: '/users', name: 'Employees', Icon: Group },
              { to: '/skills', name: 'Skills', Icon: TrendingUp },
              { to: '/languages', name: 'Languages', Icon: TrendingUp },
            ].map(({ to, name, Icon }) => (
              <li key={to} className="flex xl:flex-col xl:first:mt-12">
                <Link
                  activeOptions={{ exact: true }}
                  to={to}
                  activeProps={{
                    className:
                      'text-neutral-800 bg-neutral-200 hover:bg-neutral-200 hover:text-neutral-800 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-600 dark:hover:text-white',
                  }}
                  className="flex items-center gap-4 rounded-full px-6 py-3 text-base text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700 xl:rounded-none xl:rounded-r-full dark:text-neutral-300 dark:hover:bg-neutral-600 dark:hover:text-white"
                >
                  <Icon />
                  {t(name)}
                </Link>
              </li>
            ))}

            <li className="flex xl:flex-col">
              <Link
                activeOptions={{ exact: true }}
                to="/cvs"
                activeProps={{
                  className:
                    'text-neutral-800 bg-neutral-200 hover:bg-neutral-200 hover:text-neutral-800 dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-600 dark:hover:text-white',
                }}
                className="hidden items-center gap-4 rounded-full px-6 py-3 text-base text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700 xl:flex xl:rounded-none xl:rounded-r-full dark:text-neutral-300 dark:hover:bg-neutral-600 dark:hover:text-white"
              >
                <ContactPageOutlined />
                {t('CVs')}
              </Link>
            </li>

            <li className="overflow-hidden xl:mt-auto">
              <Link
                to="/users/$userId/profile"
                params={{ userId: '1' }}
                className="flex items-center gap-4 rounded-full p-1 pr-6 text-base hover:bg-neutral-200 xl:rounded-none xl:rounded-r-full dark:text-neutral-300 dark:hover:bg-neutral-600 dark:hover:text-white"
              >
                <UserAvatar className="size-10 bg-primary text-white dark:text-neutral-600">H</UserAvatar>
                <span className="overflow-hidden text-nowrap text-ellipsis">Rostislav Bobrov</span>
              </Link>
            </li>
          </ul>
        </nav>

        <button className="hidden px-2 py-4 hover:bg-neutral-200 active:bg-neutral-300 xl:flex dark:hover:bg-neutral-600 dark:active:bg-neutral-700">
          <ChevronLeft />
        </button>
      </aside>

      <Outlet />
    </div>
  );
}
