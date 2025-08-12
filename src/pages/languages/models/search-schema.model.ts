import * as z from 'zod/v4';
import { languagesSortingFields } from '~/features/languages';

export const languagesSearchSchema = z.object({
  sort: z.enum(languagesSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});
