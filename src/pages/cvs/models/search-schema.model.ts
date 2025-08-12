import * as z from 'zod/v4';
import { cvsSortingFields } from '~/features/cvs';

export const cvsSearchSchema = z.object({
  sort: z.enum(cvsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});
