import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { cvOptions } from '~/features';
import { Breadcrumbs, mergeBreadcrumbs, TabLink, Tabs, type Cv } from '~/shared';

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout')({
  component: RouteComponent,
  beforeLoad: ({ params, context }) => {
    const { queryClient } = context;
    const cv = queryClient.getQueryData(['cv', params.cvId]) as Cv | undefined;

    if (cv) {
      return {
        breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Cvs', to: '/cvs' }, { title: cv.name }),
      };
    }

    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Cvs', to: '/cvs' }, { title: '...' }),
    };
  },
  loader: ({ context, params }) => {
    const { auth, queryClient } = context;
    queryClient.prefetchQuery(cvOptions({ id: params.cvId, accessToken: auth!.accessToken }));
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
            search={{ sort: 'name', order: 'asc', q: '' }}
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
