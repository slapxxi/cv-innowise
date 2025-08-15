import * as z from 'zod/v4';

export const deleteSkillsSchema = z.object({
  skills: z.string().array().min(1),
});
