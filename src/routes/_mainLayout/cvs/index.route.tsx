import { createFileRoute } from '@tanstack/react-router';
import { cvsOptions } from '~/features/cvs';
import { CvsPage, cvsSearchSchema } from '~/pages/cvs';

export const Route = createFileRoute('/_mainLayout/cvs/')({
  component: CvsPage,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(cvsOptions());
  },
  validateSearch: cvsSearchSchema,
});
