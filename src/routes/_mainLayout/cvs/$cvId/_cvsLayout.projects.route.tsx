import { createFileRoute } from '@tanstack/react-router';
import { projectsOptions } from '~/features/projects';
import { CvsProjectsPage, cvsProjectsSearchSchema } from '~/pages/cvs';
import { mergeBreadcrumbs } from '~/shared/utils';

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout/projects')({
  beforeLoad: ({ context, search }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, {
        title: 'Projects',
        to: '/cvs/$cvId/projects',
        props: { search },
      }),
    };
  },
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(projectsOptions());
  },
  validateSearch: cvsProjectsSearchSchema,
  component: CvsProjectsPage,
});
