import '@testing-library/jest-dom';

jest.mock('@tanstack/react-router', () => {
  const actual = jest.requireActual('@tanstack/react-router');
  return {
    ...actual,
    getRouteApi: jest.fn(() => ({ useParams: jest.fn(() => ({ userId: '1' })) })),
  };
});

jest.mock('react-i18next', () => {
  return {
    useTranslation: jest.fn(() => ({ t: (key) => key })),
  };
});

jest.mock('~/shared/lib/http', () => ({}));

jest.mock('~/app/hooks', () => ({
  useAuth: jest.fn(() => ({})),
}));
