import { createFileRoute } from '@tanstack/react-router';
import { departmentsOptions } from '~/features/departments';
import { DepartmentsPage, departmentsSearchSchema } from '~/pages/departments';

export const Route = createFileRoute('/_mainLayout/departments')({
  component: DepartmentsPage,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(departmentsOptions());
  },
  validateSearch: departmentsSearchSchema,
});
