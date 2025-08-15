import { ChevronRight } from '@mui/icons-material';
import { Link } from '@tanstack/react-router';
import { Fragment } from 'react';
import { useBreadcrumbs } from '~/shared/hooks';

type BreadcrumbsProps = {
  className?: string;
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  const { className } = props;
  const breadcrumbs = useBreadcrumbs();

  return (
    <nav className={className}>
      <ul className="flex items-center gap-3">
        {breadcrumbs.map(({ title, to, icon, props }, i) => (
          <Fragment key={i}>
            <li>
              {to ? (
                <Link
                  className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400"
                  to={to}
                  activeProps={{ className: 'text-primary/60 dark:text-primary/60' }}
                  activeOptions={{ exact: true }}
                  {...props}
                >
                  {icon}
                  {title}
                </Link>
              ) : (
                <span className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                  {icon}
                  {title}
                </span>
              )}
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
