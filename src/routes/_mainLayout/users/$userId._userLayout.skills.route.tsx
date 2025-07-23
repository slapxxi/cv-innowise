import { Add, DeleteForever } from '@mui/icons-material';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '~/app';
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
  const auth = useAuth();
  const { user } = useUser({ id: params.userId });

  return (
    <div className="px-6 py-4">
      <Text asChild variant="light">
        <h2>{t('Skills')}</h2>
      </Text>

      <div className="xl:max-w-[900px] mx-auto">
        {user.skillsByCategories &&
          Object.entries(user.skillsByCategories).map(([categoryName, skills]) => (
            <section key={categoryName} className="my-8">
              <h2 className="mb-4">{categoryName}</h2>

              <div className="grid grid-cols-2 gap-4 auto-rows-[minmax(50px,auto)] xl:grid-cols-3">
                {skills.map((s, i) => (
                  <div className="flex gap-2 items-center select-none" key={i}>
                    <SkillBar mastery={s.mastery} className="max-w-[100px]" />
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}

        {auth!.user.id === user.id && (
          <div className="flex justify-end xl:gap-15 xl:mt-20">
            <Button variant="text" startIcon={<Add />}>
              Add Skill
            </Button>

            <Button variant="text" startIcon={<DeleteForever />} dangerous>
              Remove Skills
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
