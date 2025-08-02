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
  return {
    useTranslation: () => ({ t: (key: string) => key }),
  };
});

jest.mock('~/app/hooks', () => ({
  useAuth: jest.fn(() => ({})),
}));

jest.mock('~/shared/lib/http/env', () => {
  return {
    API_URL: process.env.API_URL,
  };
});
