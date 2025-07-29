import type { BreadcrumbEntry } from '~/shared';

export function mergeBreadcrumbs(a: BreadcrumbEntry[] | undefined, ...b: BreadcrumbEntry[]) {
  return [...(a ?? []), ...b];
}
