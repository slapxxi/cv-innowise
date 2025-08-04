import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchUserFormData } from '~/shared';
import type { Department, Position } from '~/shared';

type FormData = {
  departments: Department[];
  positions: Position[];
};

export function useUserFormData() {
  return useSuspenseQuery<FormData, Error>({
    queryKey: ['user-form-data'],
    queryFn: async () => {
      const formDataResult = await fetchUserFormData();
      if (formDataResult.ok) {
        return formDataResult.data;
      }
      throw formDataResult.error;
    },
    staleTime: Infinity,
  });
}
