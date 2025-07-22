import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button, Text } from '~/shared';
import { Add, DeleteForever } from '@mui/icons-material';

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
      <Text asChild variant="light">
        <h2>{t('Skills')}</h2>
      </Text>

      <Button variant="text" startIcon={<Add />}>
        Add Skill
      </Button>
      <Button variant="text" startIcon={<DeleteForever />} dangerous>
        Remove Skills
      </Button>
    </div>
  );
}
