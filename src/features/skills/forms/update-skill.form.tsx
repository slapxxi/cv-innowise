import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod/v4';
import { masteryLevels, useAuth } from '~/app';
import { Button, Select, SelectItem, updateProfileSkill, type SkillMastery } from '~/shared';

const routeApi = getRouteApi('/_mainLayout/users/$userId/_userLayout/skills');

const updateSkillSchema = z.object({
  masteryLevel: z.enum(masteryLevels),
});

type UpdateSkillForm = z.infer<typeof updateSkillSchema>;

type AddSkillFormProps = { skill: SkillMastery; onSuccess: () => void; onCancel: () => void };

export const UpdateSkillForm: React.FC<AddSkillFormProps> = (props) => {
  const { skill, onSuccess, onCancel } = props;
  const auth = useAuth();
  const params = routeApi.useParams();
  const form = useForm<UpdateSkillForm>({
    resolver: zodResolver(updateSkillSchema),
    defaultValues: {
      masteryLevel: skill.mastery,
    },
  });
  const labelProps = {
    className: 'bg-bg dark:bg-neutral-600',
  };

  const handleSubmit: SubmitHandler<UpdateSkillForm> = async (data) => {
    await updateProfileSkill({
      skill: { userId: params.userId, name: skill.name, categoryId: skill.categoryId, mastery: data.masteryLevel },
      accessToken: auth!.accessToken,
    });
    onSuccess();
  };

  return (
    <form className="flex flex-col gap-8 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-4">
        <Select label="Category" className="w-full" labelProps={labelProps} value={skill.name} disabled>
          <SelectItem value={skill.name}>{skill.name}</SelectItem>
        </Select>

        <Controller
          name="masteryLevel"
          control={form.control}
          render={({ field }) => (
            <Select label="Mastery Level" className="w-full" labelProps={labelProps} {...field}>
              {masteryLevels.map((ml) => (
                <SelectItem key={ml} value={ml}>
                  {ml}
                </SelectItem>
              ))}
            </Select>
          )}
        />
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
