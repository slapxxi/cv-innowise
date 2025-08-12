import { getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { UpdateCvForm, useCv, useUpdateCv } from '~/features/cvs';
import { Button, Text } from '~/shared/ui';

const routeApi = getRouteApi('/_mainLayout/cvs/$cvId/_cvsLayout/details');

export function CvsDetailsPage() {
  const params = routeApi.useParams();
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
