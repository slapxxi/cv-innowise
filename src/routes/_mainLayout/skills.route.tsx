import { createFileRoute } from '@tanstack/react-router';
import { skillsOptions } from '~/features/skills';
import { SkillsPage, skillsSearchSchema } from '~/pages/skills';

export const Route = createFileRoute('/_mainLayout/skills')({
  component: SkillsPage,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(skillsOptions());
  },
  validateSearch: skillsSearchSchema,
});
