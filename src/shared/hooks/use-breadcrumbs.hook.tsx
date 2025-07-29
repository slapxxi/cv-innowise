import { useMatches } from '@tanstack/react-router';
import { uniqBy } from 'lodash';
import { useTranslation } from 'react-i18next';

export function useBreadcrumbs() {
  const { t } = useTranslation();
  const matches = useMatches();
  const bc = matches.filter((m) => m.context.breadcrumb).map((m) => m.context.breadcrumb!) as {
    title: string;
    pathname: string;
    icon?: React.ReactNode;
  }[];
  return uniqBy(bc, 'pathname').map((b) => ({ ...b, title: t(b.title) }));
}
