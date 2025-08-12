import type { BreadcrumbEntry } from '../types';

export function mergeBreadcrumbs(a: BreadcrumbEntry[] | undefined, ...b: BreadcrumbEntry[]) {
  return [...(a ?? []), ...b];
}
