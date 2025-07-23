import { Add, DeleteForever } from '@mui/icons-material';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useUser } from '~/features';
import { Button, SkillBar, Text } from '~/shared';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/skills')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    return { breadcrumb: { title: 'Skills', pathname: `/users/${params.userId}/skills` } };
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  const params = Route.useParams();
  const { user } = useUser({ id: params.userId });
  const skills = user.profile.skills;

  return (
    <div>
      <Text asChild variant="light">
        <h2>{t('Skills')}</h2>
      </Text>

      <section>
        <div className="grid grid-cols-2 gap-4 auto-rows-[minmax(50px,auto)]">
          {skills.map((s, i) => (
            <div className="flex gap-2 items-center select-none" key={i}>
              <SkillBar mastery={s.mastery} className="max-w-[100px]" />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      <Button variant="text" startIcon={<Add />}>
        Add Skill
      </Button>

      <Button variant="text" startIcon={<DeleteForever />} dangerous>
        Remove Skills
      </Button>
    </div>
  );
}
