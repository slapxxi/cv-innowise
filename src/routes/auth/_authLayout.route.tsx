import { createFileRoute } from '@tanstack/react-router';
import { AuthLayoutPage, authSearchSchema } from '~/pages/auth';

export const Route = createFileRoute('/auth/_authLayout')({
  component: AuthLayoutPage,
  validateSearch: authSearchSchema,
});
