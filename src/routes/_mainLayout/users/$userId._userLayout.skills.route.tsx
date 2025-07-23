import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Close as CloseIcon, DeleteForever } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { masteryLevels, useAuth } from '~/app';
import { getSkillsQueryOptions, useCreateProfileSkill, useSkills, useUser } from '~/features';
import { Button, deleteProfileSkill, Modal, Select, SelectItem, SkillBar, Text, type SkillMastery } from '~/shared';

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/skills')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    return { breadcrumb: { title: 'Skills', pathname: `/users/${params.userId}/skills` } };
  },
  loader: ({ context }) => {
    const { auth, queryClient } = context;
    queryClient.prefetchQuery(getSkillsQueryOptions({ accessToken: auth!.accessToken }));
  },
});

const createSkillSchema = z.object({
  skillId: z.string(),
  masteryLevel: z.enum(masteryLevels),
});

type CreateSkillForm = z.infer<typeof createSkillSchema>;

function RouteComponent() {
  const { t } = useTranslation();
  const params = Route.useParams();
  const auth = useAuth();
  const { user } = useUser({ id: params.userId });
  const { skills } = useSkills();
  const [open, setOpen] = useState(false);
  const form = useForm<CreateSkillForm>({
    resolver: zodResolver(createSkillSchema),
  });
  const router = useRouter();
  const { createProfileSkill } = useCreateProfileSkill({
    onSuccess: () => {
      setOpen(false);
      router.invalidate();
    },
  });

  const handleSubmit: SubmitHandler<CreateSkillForm> = async (data) => {
    const skill = skills.find((s) => s.id === data.skillId)!;
    const categoryId = skill?.category?.id;
    createProfileSkill({ skill: { userId: params.userId, name: skill.name, categoryId, mastery: data.masteryLevel } });
  };

  async function handleDelete(skill: SkillMastery) {
    await deleteProfileSkill({ skill: { userId: params.userId, name: skill.name }, accessToken: auth!.accessToken });
    router.invalidate();
  }

  return (
    <div className="px-6 py-4">
      <Text asChild variant="light">
        <h2>{t('Skills')}</h2>
      </Text>

      <Modal open={open} title="Add Skill" onClose={() => setOpen(false)}>
        <form className="flex flex-col gap-8 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-4">
            <Select label="Category" className="w-full" {...form.register('skillId')}>
              <SelectItem value="">None</SelectItem>
              {skills
                .filter((s) => !user.profile.skills.find((sm) => sm.name === s.name))
                .map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
            </Select>

            <Select label="Mastery Level" className="w-full" {...form.register('masteryLevel')}>
              {masteryLevels.map((ml) => (
                <SelectItem value={ml} key={ml}>
                  {ml}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </div>
        </form>
      </Modal>

      <div className="xl:max-w-[900px] mx-auto">
        {user.skillsByCategories &&
          Object.entries(user.skillsByCategories).map(([categoryName, skills]) => (
            <section key={categoryName} className="my-8">
              <h2 className="mb-4">{categoryName}</h2>

              <div className="grid grid-cols-2 gap-4 auto-rows-[minmax(50px,auto)] xl:grid-cols-3">
                {skills.map((s, i) => (
                  <>
                    <div className="flex gap-2 items-center select-none group" key={i}>
                      <SkillBar mastery={s.mastery} className="max-w-[100px]" />
                      <span>{s.name}</span>
                      <IconButton
                        className="invisible text-primary group-hover:visible"
                        onClick={() => handleDelete(s)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </>
                ))}
              </div>
            </section>
          ))}

        {auth!.user.id === user.id && (
          <div className="flex justify-end xl:gap-15 xl:mt-20">
            <Button variant="text" startIcon={<Add />} onClick={() => setOpen(true)}>
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
