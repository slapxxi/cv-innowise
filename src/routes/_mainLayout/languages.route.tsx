import { createFileRoute } from '@tanstack/react-router';
import { languagesOptions } from '~/features/languages';
import { LanguagesPage, languagesSearchSchema } from '~/pages/languages';

export const Route = createFileRoute('/_mainLayout/languages')({
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(languagesOptions());
  },
  validateSearch: languagesSearchSchema,
  component: LanguagesPage,
});
