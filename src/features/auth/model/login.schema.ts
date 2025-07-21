import z from 'zod/v4';
import { t } from 'i18next';

export const loginSchema = z.object({
  email: z.string().nonempty(t('Email is required')),
  password: z.string().nonempty(t('Password is required')),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
