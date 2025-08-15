import * as z from 'zod/v4';
import { departmentsSortingFields } from '~/features/departments';

export const departmentsSearchSchema = z.object({
  sort: z.enum(departmentsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});
