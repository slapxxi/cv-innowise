import type { Skill, SkillCategory } from 'cv-graphql';
import dotenv from 'dotenv';
import { graphql, HttpResponse } from 'msw';

dotenv.config({ quiet: true });

const innowise = graphql.link(process.env.API_URL as string);

export const handlers = [
  innowise.query('Categories', () => {
    return HttpResponse.json({
      data: {
        skillCategories: [
          { id: '1', name: 'Frontend', order: 1, children: [] },
          { id: '2', name: 'Backend', order: 2, children: [] },
          { id: '3', name: 'DevOps', order: 3, children: [] },
        ] satisfies SkillCategory[],
      },
    });
  }),
  innowise.query('Skills', () => {
    return HttpResponse.json({
      data: {
        skills: [
          { id: '1', name: 'JavaScript', created_at: new Date().toISOString(), category_name: 'Frontend' },
          { id: '2', name: 'TypeScript', created_at: new Date().toISOString(), category_name: 'Frontend' },
          { id: '3', name: 'React', created_at: new Date().toISOString(), category_name: 'Frontend' },
        ] satisfies Skill[],
      },
    });
  }),
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
  innowise.mutation('UpdateProfileSkill', ({ variables }) => {
    const { skill } = variables;

    return HttpResponse.json({
      data: {
        updateProfileSkill: {
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
