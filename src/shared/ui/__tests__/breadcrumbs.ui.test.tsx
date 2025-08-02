import { Breadcrumbs } from '../breadcrumbs.ui';
import { screen, render } from 'test-utils';
import { useMatches } from '@tanstack/react-router';
import type { BreadcrumbEntry } from '~/shared';

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
