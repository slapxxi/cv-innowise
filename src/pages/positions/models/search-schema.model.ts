import * as z from 'zod/v4';
import { positionsSortingFields } from '~/features/positions';

export const positionsSearchSchema = z.object({
  sort: z.enum(positionsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});
