import '@testing-library/jest-dom';
import { config } from 'dotenv';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

config({ quiet: true });

const innowise = graphql.link(process.env.API_URL);

export const handlers = [
  innowise.mutation('AddProfileSkill', ({ variables }) => {
    const { skill } = variables;

    return HttpResponse.json({
      data: {
        addProfileSkill: {
          id: '1',
          created_at: new Date().toISOString(),
          avatar: null,
          first_name: 'John',
          last_name: 'Doe',
          full_name: 'John Doe',
          email: 'G1E7w@example.com',
          skills: [{ name: skill.name, mastery: skill.mastery, categoryId: skill.categoryId }],
          languages: [{ name: 'English', proficiency: 'Native' }],
        },
      },
    });
  }),
  graphql.operation((req, res, ctx) => {
    console.warn(`Unhandled GraphQL request: ${req.operationName}`);
    return res(ctx.status(500), ctx.json({ error: `Unhandled request: ${req.operationName}` }));
  }),
];

const server = setupServer(...handlers);

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
