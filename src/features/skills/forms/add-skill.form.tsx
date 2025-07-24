import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi } from '@tanstack/react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod/v4';
import { masteryLevels } from '~/app';
import { useCreateProfileSkill, useSkills, useUser } from '~/features';
import { Button, Select, SelectItem } from '~/shared';

const routeApi = getRouteApi('/_mainLayout/users/$userId/_userLayout/skills');

const createSkillSchema = z.object({
  skillId: z.string(),
  masteryLevel: z.enum(masteryLevels),
});

type CreateSkillForm = z.infer<typeof createSkillSchema>;

type AddSkillFormProps = { onSuccess: () => void; onCancel: () => void };

export const AddSkillForm: React.FC<AddSkillFormProps> = (props) => {
  const { onSuccess, onCancel } = props;
  const params = routeApi.useParams();
  const { skills } = useSkills();
  const { user } = useUser({ id: params.userId });
  const { createProfileSkill } = useCreateProfileSkill({
    onSuccess,
  });
  const form = useForm<CreateSkillForm>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: {
      skillId: '',
      masteryLevel: masteryLevels[0],
    },
  });
  const labelProps = {
    className: 'bg-bg dark:bg-neutral-600',
  };

  const handleSubmit: SubmitHandler<CreateSkillForm> = async (data) => {
    const skill = skills.find((s) => s.id === data.skillId)!;
    const categoryId = skill?.category?.id;
    createProfileSkill({ skill: { userId: params.userId, name: skill.name, categoryId, mastery: data.masteryLevel } });
  };

  return (
    <form className="flex flex-col gap-8 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-4">
        <Select label="Category" className="w-full" labelProps={labelProps} {...form.register('skillId')}>
          <SelectItem value="">None</SelectItem>
          {skills
            .filter((s) => !user.profile.skills.find((sm) => sm.name === s.name))
            .map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
        </Select>

        <Select label="Mastery Level" className="w-full" labelProps={labelProps} {...form.register('masteryLevel')}>
          {masteryLevels.map((ml) => (
            <SelectItem value={ml} key={ml}>
              {ml}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outlined" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button type="submit">Confirm</Button>
      </div>
    </form>
  );
};
