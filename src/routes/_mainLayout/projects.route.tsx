import { createFileRoute } from '@tanstack/react-router';
import { projectsOptions } from '~/features/projects';
import { ProjectsPage, projectsSearchSchema } from '~/pages/projects';

export const Route = createFileRoute('/_mainLayout/projects')({
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(projectsOptions());
  },
  validateSearch: projectsSearchSchema,
  component: ProjectsPage,
});
