import * as z from 'zod/v4';
import { usersSortingFields } from '../services';
import { cvsSortingFields } from '~/features/cvs';

export const usersSearchSchema = z.object({
  page: z.number().min(1).catch(1),
  limit: z.number().min(1).max(100).catch(10),
  sort: z.enum(usersSortingFields).catch('firstName'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});

export const userCvsSearchSchema = z.object({
  sort: z.enum(cvsSortingFields).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  q: z.string().trim().catch(''),
});
