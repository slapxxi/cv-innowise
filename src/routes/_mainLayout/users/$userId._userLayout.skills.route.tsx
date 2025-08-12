import { createFileRoute } from '@tanstack/react-router';
import { skillsOptions } from '~/features/skills';
import { UserSkillsPage } from '~/pages/users';
import { mergeBreadcrumbs } from '~/shared/utils';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/skills')({
  beforeLoad: ({ context }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Skills', to: '/users/$userId/skills' }),
    };
  },
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(skillsOptions());
  },
  component: UserSkillsPage,
});
