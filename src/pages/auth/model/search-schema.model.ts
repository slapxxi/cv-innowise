import * as z from 'zod/v4';

export const forgotPasswordSearchSchema = z.object({ redirect: z.string().catch('/') });

export const authSearchSchema = z.object({ redirect: z.string().catch('/') });
