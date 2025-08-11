import { createFileRoute } from '@tanstack/react-router';
import { ForgotPasswordPage, forgotPasswordSearchSchema } from '~/pages/auth';

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage,
  validateSearch: forgotPasswordSearchSchema,
});
