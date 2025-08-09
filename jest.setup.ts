import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('@tanstack/react-router', () => {
  const actual = jest.requireActual('@tanstack/react-router');
  return {
    ...actual,
    getRouteApi: jest.fn(() => ({ useParams: jest.fn(() => ({ userId: '1' })) })),
  };
});

jest.mock('react-i18next', () => {
  const actual = jest.requireActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => key }),
  };
});

jest.mock('~/app/hooks', () => {
  const actual = jest.requireActual('~/app/hooks');
  return {
    ...actual,
    useAuth: jest.fn(() => ({})),
  };
});

jest.mock('~/main', () => {});

jest.mock('~/shared/lib/http/env', () => {
  return {
    API_URL: process.env.API_URL,
  };
});
