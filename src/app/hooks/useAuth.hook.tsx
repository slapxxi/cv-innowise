import { useQueryClient } from '@tanstack/react-query';
import type { Auth } from '~/shared';

export function useAuth(): Auth | null {
  const qc = useQueryClient();
  return qc.getQueryData<Auth>(['auth']) || null;
}
