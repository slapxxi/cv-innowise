import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { masteryLevels } from '~/app';
import { useCreateCvSkill, useCv, useSkills } from '~/features';
import { Button, Select, SelectItem } from '~/shared';

const routeApi = getRouteApi('/_mainLayout/cvs/$cvId/_cvsLayout/skills');

const createSkillSchema = z.object({
  skillId: z.string().trim().nonempty(),
  masteryLevel: z.enum(masteryLevels),
});

type CreateSkillForm = z.infer<typeof createSkillSchema>;

type AddSkillFormProps = { onSuccess: () => void; onCancel: () => void };

export const AddCvSkillForm: React.FC<AddSkillFormProps> = (props) => {
  const { onSuccess, onCancel } = props;
  const { t } = useTranslation();
  const params = routeApi.useParams();
  const { skills } = useSkills();
  const { cv } = useCv({ id: params.cvId });
  const { createCvSkill } = useCreateCvSkill({
    onSuccess,
  });
  const filteredSkills = skills.filter((s) => !cv.skills.find((sm) => sm.name === s.name));
  const form = useForm<CreateSkillForm>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: {
      skillId: filteredSkills[0]?.id,
      masteryLevel: masteryLevels[0],
    },
  });
  const labelProps = {
    className: 'bg-bg dark:bg-neutral-600',
  };

  const handleSubmit: SubmitHandler<CreateSkillForm> = async (data) => {
    const skill = skills.find((s) => s.id === data.skillId)!;
    const categoryId = skill?.category?.id;
    createCvSkill({
      cvId: params.cvId,
      skill: { name: skill.name, categoryId, mastery: data.masteryLevel },
    });
  };

  if (filteredSkills.length === 0) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        <p>{t('You have already added all skills')}</p>
        <Button onClick={onCancel}>{t('Cancel')}</Button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-8 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-4">
        <Controller
          name="skillId"
          control={form.control}
          render={({ field }) => (
            <Select label={t('Category')} className="w-full" labelProps={labelProps} {...field}>
              {filteredSkills.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </Select>
          )}
        />

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
