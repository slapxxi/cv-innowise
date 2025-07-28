import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchUserFormData } from '~/shared/lib/http/fetch-user-form-data.http.ts';
import type { Department, Position } from '~/shared';

type FormData = {
  departments: Department[];
  positions: Position[];
};

export function useUserFormData(params: { accessToken: string }) {
  const { accessToken } = params;
  return useSuspenseQuery<FormData, Error>({
    queryKey: ['user-form-data'],
    queryFn: async () => {
      const formDataResult = await fetchUserFormData({ accessToken });
      if (formDataResult.ok) {
        return formDataResult.data;
      }
      throw formDataResult.error;
    },
    staleTime: Infinity,
  });
}
