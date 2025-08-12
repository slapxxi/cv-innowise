import * as z from 'zod/v4';
import { projectsSortingFields } from '~/features/projects';

export const projectsSearchSchema = z.object({
  sort: z.enum(projectsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});
