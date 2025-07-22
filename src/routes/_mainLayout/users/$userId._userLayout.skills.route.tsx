import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Text } from '~/shared';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/skills')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    return { breadcrumb: { title: 'Skills', pathname: `/users/${params.userId}/skills` } };
  },
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <Text asChild>
        <h2>{t('Employees')}</h2>
      </Text>
    </div>
  );
}
