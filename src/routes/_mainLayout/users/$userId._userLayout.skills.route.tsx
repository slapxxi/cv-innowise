import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button, SkillBar, Text } from '~/shared';
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

        <div className="grid grid-cols-2 gap-4 auto-rows-[minmax(50px,auto)]">
          {[
            { name: 'React', level: 3 },
            { name: 'Angular', level: 9 },
            { name: 'Vue', level: 7 },
            { name: 'Svelte', level, color: 'magenta' },
            { name: 'Node', level: 1 },
            { name: 'PHP', level: 2 },
            { name: 'Python', level: 5 },
            { name: 'Elixir', level: 8, color: 'dodgerblue' },
          ].map((item, i) => (
            <div className="flex gap-2 items-center select-none" key={i}>
              <SkillBar level={item.level} className="max-w-[100px]" color={item.color} />
              <span>{item.name}</span>
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
