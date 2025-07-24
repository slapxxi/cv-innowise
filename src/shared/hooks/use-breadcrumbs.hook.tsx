import { useMatches } from '@tanstack/react-router';
import { uniqBy } from 'lodash';

export function useBreadcrumbs() {
  const matches = useMatches();
  const bc = matches.filter((m) => m.context.breadcrumb).map((m) => m.context.breadcrumb!) as {
    title: string;
    pathname: string;
    icon?: React.ReactNode;
  }[];
  return uniqBy(bc, 'pathname');
}
