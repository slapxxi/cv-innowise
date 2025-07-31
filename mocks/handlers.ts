import dotenv from 'dotenv';
import { graphql, HttpResponse } from 'msw';

dotenv.config({ quiet: true });

const innowise = graphql.link(process.env.API_URL as string);

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
  // @ts-expect-error who cares
  graphql.operation((req, res, ctx) => {
    console.warn(`Unhandled GraphQL request: ${req.operationName}`);
    return res(ctx.status(500), ctx.json({ error: `Unhandled request: ${req.operationName}` }));
  }),
];
