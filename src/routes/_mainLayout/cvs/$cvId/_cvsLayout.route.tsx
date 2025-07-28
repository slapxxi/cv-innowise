import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, TabLink, Tabs } from '~/shared';

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout')({
  component: RouteComponent,
  beforeLoad: () => {
    return { breadcrumb: { title: 'CVs', pathname: `/cvs` } };
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  const params = Route.useParams();
  const matches = useMatches();

  return (
    <div>
      <header className="sticky top-0 z-10 flex flex-col gap-1 bg-bg px-6 py-4 xl:px-0 dark:bg-bg-dark">
        <Breadcrumbs className="mb-4 pl-4" />

        <Tabs value={matches.at(-1)?.fullPath ?? ''}>
          <TabLink
            to="/cvs/$cvId/details"
            params={{ cvId: params.cvId }}
            value="/cvs/$cvId/details"
            label={t('Details')}
            replace
          />
          <TabLink
            to="/cvs/$cvId/skills"
            params={{ cvId: params.cvId }}
            value="/cvs/$cvId/skills"
            label={t('Skills')}
            replace
          />
          <TabLink
            to="/cvs/$cvId/projects"
            params={{ cvId: params.cvId }}
            value="/cvs/$cvId/projects"
            label={t('Projects')}
            replace
          />
          <TabLink
            to="/cvs/$cvId/preview"
            params={{ cvId: params.cvId }}
            value="/cvs/$cvId/preview"
            label={t('Preview')}
            replace
          />
        </Tabs>
      </header>
      <Outlet />
    </div>
  );
}
