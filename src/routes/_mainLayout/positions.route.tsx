import { createFileRoute } from '@tanstack/react-router';
import { positionsOptions } from '~/features/positions';
import { PositionsPage, positionsSearchSchema } from '~/pages/positions';

export const Route = createFileRoute('/_mainLayout/positions')({
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(positionsOptions());
  },
  validateSearch: positionsSearchSchema,
  component: PositionsPage,
});
