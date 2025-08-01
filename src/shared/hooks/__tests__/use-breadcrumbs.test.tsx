import { useMatches } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useBreadcrumbs } from '../use-breadcrumbs.hook';

jest.mock('@tanstack/react-router', () => ({
  useMatches: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

function BreadcrumbsTester() {
  const breadcrumbs = useBreadcrumbs();
  return (
    <ul data-testid="breadcrumbs">
      {breadcrumbs.map((b, i) => (
        <Fragment key={i}>
          <li>{b.title}</li>
          <li>{`>`}</li>
        </Fragment>
      ))}
    </ul>
  );
}

describe('useBreadcrumbs', () => {
  const mockT = jest.fn();
  const mockUseMatches = useMatches as jest.Mock;
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTranslation.mockReturnValue({ t: mockT });
  });

  it('renders translated breadcrumbs from the last route match', () => {
    mockT.mockImplementation((key) => `translated-${key}`);

    mockUseMatches.mockReturnValue([
      {
        context: {
          breadcrumbs: [
            { title: 'home', path: '/' },
            { title: 'about', path: '/about' },
          ],
        },
      },
    ]);

    render(<BreadcrumbsTester />);

    const list = screen.getByTestId('breadcrumbs');
    expect(list).toHaveTextContent('translated-home>translated-about>');
  });

  it('renders empty list when breadcrumbs missing in match context', () => {
    mockUseMatches.mockReturnValue([{ context: {} }]);
    render(<BreadcrumbsTester />);
    expect(screen.getByTestId('breadcrumbs').children).toHaveLength(0);
  });

  it('renders empty list when matches are empty', () => {
    mockUseMatches.mockReturnValue([]);
    render(<BreadcrumbsTester />);
    expect(screen.getByTestId('breadcrumbs').children).toHaveLength(0);
  });
});
