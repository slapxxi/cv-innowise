import * as z from 'zod/v4';
import { skillsSortingFields } from '~/features/skills';

export const skillsSearchSchema = z.object({
  sort: z.enum(skillsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});
