import { useMatches } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export function useBreadcrumbs() {
  const { t } = useTranslation();
  const matches = useMatches();
  const breadcrumbs = matches.at(-1)?.context.breadcrumbs ?? [];
  return breadcrumbs.map((b) => ({ ...b, title: t(b.title) }));
}
