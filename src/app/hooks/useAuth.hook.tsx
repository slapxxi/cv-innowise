import { useQueryClient } from '@tanstack/react-query';
import type { Auth, User } from '~/shared';

export function useAuth(): Auth {
  const qc = useQueryClient();
  return { user: qc.getQueryData<User>(['auth', 'user']) ?? null };
}
