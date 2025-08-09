import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { useAuth } from '~/app';
import { useCreateCv } from '~/features';
import { Button, TextField } from '~/shared';

const createCvSchema = z.object({
  name: z.string().trim().nonempty('Name is required'),
  description: z.string().trim().nonempty('Description is required'),
  education: z.string().optional(),
});

type CreateCvForm = z.infer<typeof createCvSchema>;

type AddCvFormProps = { onSuccess: () => void; onCancel: () => void };

export const AddCvForm: React.FC<AddCvFormProps> = (props) => {
  const { onSuccess, onCancel } = props;
  const { t } = useTranslation();
  const auth = useAuth();
  const { createCv } = useCreateCv({
    onSuccess,
  });

  const form = useForm<CreateCvForm>({
    resolver: zodResolver(createCvSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit: SubmitHandler<CreateCvForm> = async (data) => {
    createCv({
      userId: auth.user!.id,
      cv: data,
    });
  };

  return (
    <form className="flex flex-col gap-8 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-4">
        <TextField
          label={t('Name')}
          {...form.register('name')}
          error={!!form.formState.errors.name}
          helperText={form.formState.errors.name?.message && t(form.formState.errors.name?.message)}
        />
        <TextField label={t('Education')} {...form.register('education')} />
        <TextField
          multiline
          rows={8}
          label={t('Description')}
          {...form.register('description')}
          error={!!form.formState.errors.description}
          helperText={form.formState.errors.description?.message && t(form.formState.errors.description?.message)}
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
