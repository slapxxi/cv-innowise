import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { masteryLevels } from '~/app';
import { useUpdateProfileSkill } from '~/features/auth';
import { Button, Select, SelectItem, type SkillMastery } from '~/shared';

const routeApi = getRouteApi('/_mainLayout/users/$userId/_userLayout/skills');

const updateSkillSchema = z.object({
  masteryLevel: z.enum(masteryLevels),
});

type UpdateSkillForm = z.infer<typeof updateSkillSchema>;

type AddSkillFormProps = { skill: SkillMastery; onSuccess: () => void; onCancel: () => void };

export const UpdateSkillForm: React.FC<AddSkillFormProps> = (props) => {
  const { skill, onSuccess, onCancel } = props;
  const { t } = useTranslation();
  const params = routeApi.useParams();
  const form = useForm<UpdateSkillForm>({
    resolver: zodResolver(updateSkillSchema),
    defaultValues: {
      masteryLevel: skill.mastery,
    },
  });
  const { updateProfileSkill } = useUpdateProfileSkill({
    onSuccess,
  });
  const labelProps = {
    className: 'bg-bg dark:bg-neutral-600',
  };

  const handleSubmit: SubmitHandler<UpdateSkillForm> = (data) => {
    updateProfileSkill({
      userId: params.userId,
      skill: { name: skill.name, categoryId: skill.categoryId, mastery: data.masteryLevel },
    });
  };

  return (
    <form className="flex flex-col gap-8 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-4">
        <Select label={t('Category')} className="w-full" labelProps={labelProps} value={skill.name} disabled>
          <SelectItem value={skill.name}>{skill.name}</SelectItem>
        </Select>

        <Controller
          name="masteryLevel"
          control={form.control}
          render={({ field }) => (
            <Select label={t('Mastery Level')} className="w-full" labelProps={labelProps} {...field}>
              {masteryLevels.map((ml) => (
                <SelectItem key={ml} value={ml}>
                  {t(ml)}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outlined" onClick={() => onCancel()}>
          {t('Cancel')}
        </Button>
        <Button type="submit">{t('Confirm')}</Button>
      </div>
    </form>
  );
};
