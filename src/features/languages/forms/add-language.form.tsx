import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { useCreateProfileLanguage, useLanguages, useUser } from '~/features';
import { Button, proficiencyLevels, Select, SelectItem } from '~/shared';

const routeApi = getRouteApi('/_mainLayout/users/$userId/_userLayout/languages');

const createLanguageSchema = z.object({
  languageId: z.string().trim().nonempty(),
  proficiency: z.enum(proficiencyLevels),
});

type AddLanguageForm = z.infer<typeof createLanguageSchema>;

type AddLanguageFormProps = { onSuccess: () => void; onCancel: () => void };

export const AddLanguageForm: React.FC<AddLanguageFormProps> = (props) => {
  const { onSuccess, onCancel } = props;
  const { t } = useTranslation();
  const params = routeApi.useParams();
  const { languages } = useLanguages();
  const { user } = useUser({ id: params.userId });
  const { createProfileLanguage } = useCreateProfileLanguage({
    onSuccess,
  });

  const filteredLanguages = languages.filter((s) => !user.profile.languages.find((sm) => sm.name === s.name));
  const form = useForm<AddLanguageForm>({
    resolver: zodResolver(createLanguageSchema),
    defaultValues: {
      languageId: filteredLanguages[0]?.id,
      proficiency: proficiencyLevels[0],
    },
  });

  const labelProps = {
    className: 'bg-bg dark:bg-neutral-600',
  };

  const handleSubmit: SubmitHandler<AddLanguageForm> = async (data) => {
    const language = languages.find((s) => s.id === data.languageId)!;
    createProfileLanguage({
      userId: params.userId,
      language: { name: language.name, proficiency: data.proficiency },
    });
  };

  if (filteredLanguages.length === 0) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        <p>{t('You have already added all languages')}</p>
        <Button onClick={onCancel}>{t('Cancel')}</Button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-8 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-4">
        <Controller
          name="languageId"
          control={form.control}
          render={({ field }) => (
            <Select label={t('Language')} className="w-full" labelProps={labelProps} {...field}>
              {filteredLanguages.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {t(s.name)}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="proficiency"
          control={form.control}
          render={({ field }) => (
            <Select label={t('Language proficiency')} className="w-full" labelProps={labelProps} {...field}>
              {proficiencyLevels.map((pl) => (
                <SelectItem key={pl} value={pl}>
                  {t(pl)}
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
