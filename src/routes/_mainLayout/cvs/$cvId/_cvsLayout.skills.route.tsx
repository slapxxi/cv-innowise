import { createFileRoute } from '@tanstack/react-router';
import { skillsOptions } from '~/features/skills';
import { CvsSkillsPage } from '~/pages/cvs';
import { mergeBreadcrumbs } from '~/shared/utils';

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout/skills')({
  beforeLoad: ({ context, location }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Skills', to: location.pathname }),
    };
  },
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(skillsOptions());
  },
  component: CvsSkillsPage,
});
