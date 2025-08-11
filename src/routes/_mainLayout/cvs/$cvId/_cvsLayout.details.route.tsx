import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { cvOptions, UpdateCvForm, useCv, useUpdateCv } from '~/features';
import { Button, mergeBreadcrumbs, Text } from '~/shared';

export const Route = createFileRoute('/_mainLayout/cvs/$cvId/_cvsLayout/details')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    return {
      breadcrumbs: mergeBreadcrumbs(context.breadcrumbs, { title: 'Details', to: location.pathname }),
    };
  },
  loader: ({ context, params }) => {
    const { queryClient } = context;
    queryClient.prefetchQuery(cvOptions({ id: params.cvId }));
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const { t } = useTranslation();
  const { cv } = useCv({ id: params.cvId });
  const { updateCv, isPending, isSuccess } = useUpdateCv();

  const handleSubmit: React.ComponentProps<typeof UpdateCvForm>['onSubmit'] = (cv) => {
    updateCv({
      cvId: params.cvId,
      cv: {
        name: cv.name,
        description: cv.description,
        education: cv.education,
      },
    });
  };

  return (
    <div className="max-w-[900px] mx-auto">
      {isSuccess && <Text variant="success">Updated Successfully!</Text>}

      <UpdateCvForm cv={cv!} animate={false} onSubmit={handleSubmit}>
        <Button type="submit" className="self-end min-w-xs" disabled={isPending}>
          {t('Update')}
        </Button>
      </UpdateCvForm>
    </div>
  );
}
