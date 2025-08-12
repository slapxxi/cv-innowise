import { getRouteApi } from '@tanstack/react-router';
import { useCv } from '~/features/cvs';
import { CvPreview } from '.';

const routeApi = getRouteApi('/_mainLayout/cvs/$cvId/_cvsLayout/preview');

export function CvsPreviewPage() {
  const params = routeApi.useParams();
  const { cv } = useCv({ id: params.cvId });

  return <CvPreview cv={cv} />;
}
