import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button, Text, UserSkill } from '~/shared';
import { Add, DeleteForever } from '@mui/icons-material';
import { useState } from 'react';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/skills')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    return { breadcrumb: { title: 'Skills', pathname: `/users/${params.userId}/skills` } };
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  const [level, setLevel] = useState(3);

  return (
    <div onClick={() => setLevel(() => Math.random() * 10)}>
      <Text asChild variant="light">
        <h2>{t('Skills')}</h2>
      </Text>

      <section>
        <Text asChild>
          <h3>Programming Languages</h3>
        </Text>

        <div className="grid grid-cols-2 gap-4 grid-rows-[min(100px)]">
          <div className="flex gap-2 items-center">
            <UserSkill level={level} className="max-w-[100px]" />
            <span>React</span>
          </div>
          <div className="flex gap-2 items-center">
            <UserSkill level={8} className="max-w-[100px]" />
            <span>Storybook</span>
          </div>
          <div className="flex gap-2 items-center">
            <UserSkill level={5} className="max-w-[100px]" />
            <span>Vue</span>
          </div>
          <div className="flex gap-2 items-center">
            <UserSkill level={level} className="max-w-[100px]" />
            <span>React</span>
          </div>
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
