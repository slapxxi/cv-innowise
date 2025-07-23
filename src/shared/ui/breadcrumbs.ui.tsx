import { ChevronRight } from '@mui/icons-material';
import { Link } from '@tanstack/react-router';
import { Fragment } from 'react';
import { useBreadcrumbs } from '~/shared';

type BreadcrumbsProps = {
  className?: string;
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  const { className } = props;
  const breadcrumbs = useBreadcrumbs();

  return (
    <nav className={className}>
      <ul className="flex items-center gap-3">
        {breadcrumbs.map(({ title, pathname, icon }) => (
          <Fragment key={pathname}>
            <li>
              <Link
                className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400"
                to={pathname}
                activeProps={{ className: 'text-primary/60 dark:text-primary/60' }}
                activeOptions={{ exact: true }}
              >
                {icon}
                {title}
              </Link>
            </li>
            <li className="last:hidden">
              <ChevronRight fontSize="small" className="text-neutral-400 dark:text-neutral-500" />
            </li>
          </Fragment>
        ))}
      </ul>
    </nav>
  );
};
