import type { BreadcrumbEntry } from '~/shared/types';
import { mergeBreadcrumbs } from '../merge-breadcrumbs.util';

describe('mergeBreadcrumbs', () => {
  const entry = (title: string): BreadcrumbEntry => ({ title, to: `/${title.toLowerCase()}` });

  it('merges undefined with additional entries', () => {
    const result = mergeBreadcrumbs(undefined, entry('Home'), entry('About'));
    expect(result).toEqual([
      { title: 'Home', to: '/home' },
      { title: 'About', to: '/about' },
    ]);
  });

  it('merges empty array with additional entries', () => {
    const result = mergeBreadcrumbs([], entry('Docs'));
    expect(result).toEqual([{ title: 'Docs', to: '/docs' }]);
  });

  it('merges existing entries with new ones', () => {
    const a = [entry('Home')];
    const b = [entry('Docs'), entry('API')];
    const result = mergeBreadcrumbs(a, ...b);
    expect(result).toEqual([
      { title: 'Home', to: '/home' },
      { title: 'Docs', to: '/docs' },
      { title: 'API', to: '/api' },
    ]);
  });

  it('returns an empty array when all inputs are empty or undefined', () => {
    expect(mergeBreadcrumbs(undefined)).toEqual([]);
    expect(mergeBreadcrumbs([])).toEqual([]);
  });

  it('does not mutate the original array', () => {
    const a = [entry('Home')];
    const result = mergeBreadcrumbs(a, entry('Blog'));
    expect(a).toEqual([{ title: 'Home', to: '/home' }]); // original unchanged
    expect(result).toEqual([
      { title: 'Home', to: '/home' },
      { title: 'Blog', to: '/blog' },
    ]);
  });
});
