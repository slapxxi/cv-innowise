import { useMatches } from '@tanstack/react-router';
import { render, screen } from 'test-utils';
import type { BreadcrumbEntry } from '~/shared/types';
import { Breadcrumbs } from '../breadcrumbs.ui';

jest.mock('@tanstack/react-router', () => {
  const actual = jest.requireActual('@tanstack/react-router');
  return {
    ...actual,
    useMatches: jest.fn(() => []),
  };
});

describe('Breadcrumbs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useMatches as jest.Mock).mockReturnValue([
      { context: { breadcrumbs: [{ title: 'home' }, { title: 'about' }] satisfies BreadcrumbEntry[] } },
    ]);
  });

  it('renders breadcrumbs from the last route match', () => {
    render(<Breadcrumbs />);
    expect(screen.getByText('home')).toBeInTheDocument();
    expect(screen.getByText('about')).toBeInTheDocument();
  });
});
