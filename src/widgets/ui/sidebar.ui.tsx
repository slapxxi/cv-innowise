import {
  Business as BusinessIcon,
  ChevronLeft,
  ChevronRight,
  ContactPageOutlined,
  FolderCopyOutlined as FolderIcon,
  Group,
  GTranslate,
  TrendingUp,
  WorkOutline as WorkIcon,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { Link, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '~/app';
import { ActionMenu, ActionMenuItem, ActionMenuItemLink, cn, UserAvatar, type User } from '~/shared';

const navItems = [
  { to: '/users', name: 'Employees', icon: <Group />, props: { className: 'xl:mt-12' } },
  { to: '/skills', name: 'Skills', icon: <TrendingUp /> },
  { to: '/languages', name: 'Languages', icon: <GTranslate /> },
  { to: '/projects', name: 'Projects', icon: <FolderIcon />, props: { className: 'hidden xl:flex' } },
  { to: '/positions', name: 'Positions', icon: <WorkIcon />, admin: true, props: { className: 'hidden xl:flex' } },
  {
    to: '/departments',
    name: 'Departments',
    icon: <BusinessIcon />,
    admin: true,
    props: { className: 'hidden xl:flex' },
  },
  { to: '/cvs', name: 'CVs', icon: <ContactPageOutlined />, props: { className: 'hidden xl:flex' } },
];

export function Sidebar() {
  const { t } = useTranslation();
  const router = useRouter();
  const auth = useAuth();
  const [open, setOpen] = useState(true);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);

  const user = auth.user as User;

  function handleToggleOpen() {
    setOpen((o) => !o);
  }

  function handleLogout() {
    auth.logout();
  }

  useEffect(() => {
    const unsub = router.subscribe('onLoad', ({ fromLocation, toLocation }) => {
      if (fromLocation?.pathname !== toLocation.pathname) {
        setActionMenuOpen(false);
      }
    });
    return unsub;
  }, []);

  return (
    <aside
      className={cn(
        'fixed bottom-0 w-full bg-white z-10',
        'dark:bg-neutral-700',
        'xl:sticky xl:top-0 xl:h-screen xl:flex xl:flex-col xl:w-auto xl:max-w-[300px]'
      )}
    >
      <nav className="xl:flex xl:flex-1 xl:flex-col">
        <ul
          className={cn(
            'flex justify-between gap-1 px-4 py-2',
            'xl:flex-1 xl:flex-col xl:justify-start xl:gap-3 xl:p-0'
          )}
        >
          {navItems.map(({ to, name, icon, props }) => (
            <SidebarItem open={open} key={to} to={to} icon={icon} label={t(name)} {...props} />
          ))}

          <ActionMenu
            open={actionMenuOpen}
            onOpen={() => setActionMenuOpen(true)}
            onClose={() => setActionMenuOpen(false)}
            trigger={
              <Box className="overflow-hidden xl:mt-auto cursor-pointer">
                <Box
                  className={cn(
                    'flex items-center gap-4 rounded-full p-1 pr-6 text-base hover:bg-neutral-200',
                    'dark:text-neutral-300 dark:hover:bg-neutral-600 dark:hover:text-white',
                    'xl:rounded-none xl:rounded-r-full'
                  )}
                >
                  <UserAvatar user={user} className="size-10 bg-primary text-white dark:text-neutral-600" />

                  {
                    <span className={cn('overflow-hidden text-nowrap text-ellipsis', !open && 'xl:hidden')}>
                      {user.email}
                    </span>
                  }
                </Box>
              </Box>
            }
          >
            <ActionMenuItemLink
              to="/users/$userId/profile"
              params={{ userId: user.id }}
              onClick={() => setActionMenuOpen(false)}
            >
              {t('Profile')}
            </ActionMenuItemLink>
            <ActionMenuItemLink to="/settings" onClick={() => setActionMenuOpen(false)}>
              {t('Settings')}
            </ActionMenuItemLink>
            <ActionMenuItem onClick={handleLogout}>{t('Log out')}</ActionMenuItem>
          </ActionMenu>
        </ul>
      </nav>

      <button
        className="hidden px-2 py-4 hover:bg-neutral-200 active:bg-neutral-300 xl:flex dark:hover:bg-neutral-600 dark:active:bg-neutral-700"
        onClick={handleToggleOpen}
      >
        {open ? <ChevronLeft /> : <ChevronRight />}
      </button>
    </aside>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  to: string;
  className?: string;
  exact?: boolean;
}

export const SidebarItem: React.FC<NavItemProps> = (props) => {
  const { to, icon, label, open, exact = false, className = '' } = props;

  return (
    <li className={cn(`flex xl:flex-col`, className)}>
      <Link
        to={to}
        activeOptions={{ exact }}
        activeProps={{
          className: cn(
            'bg-neutral-200 text-neutral-800 hover:bg-neutral-200 hover:text-neutral-800',
            'dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-600 dark:hover:text-white'
          ),
        }}
        className={cn(
          'flex items-center gap-4 rounded-full px-6 py-3 text-base text-neutral-600 hover:bg-neutral-200 hover:text-neutral-700',
          'dark:text-neutral-300 dark:hover:bg-neutral-600 dark:hover:text-white',
          'xl:rounded-none xl:rounded-r-full'
        )}
      >
        {icon}
        <span className={cn('text-nowrap overflow-hidden text-ellipsis', !open && 'xl:hidden')}>{label}</span>
      </Link>
    </li>
  );
};
