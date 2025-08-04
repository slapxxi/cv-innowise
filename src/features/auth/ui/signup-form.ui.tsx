import { zodResolver } from '@hookform/resolvers/zod';
import { identity } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { useSignup } from '~/features';
import { Button, ButtonLink, FormErrors, PasswordField, TextField } from '~/shared';

const formSchema = z.object({
  email: z.string().nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});

export const SignupForm = () => {
  const { t } = useTranslation();
  type SignupForm = z.infer<typeof formSchema>;
  const form = useForm<SignupForm>({
    resolver: zodResolver(formSchema),
  });
  const { signup, isPending, error } = useSignup({});

  const handleSubmit = (data: SignupForm) => {
    signup(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="contents">
      <div className="flex flex-col gap-4">
        <TextField
          label={t('Email')}
          placeholder="example@email.com"
          error={!!form.formState.errors.email}
          type="email"
          helperText={form.formState.errors.email?.message ? t(form.formState.errors.email?.message) : ''}
          {...form.register('email')}
        />

        <PasswordField
          label={t('Password')}
          placeholder={t('Password')}
          error={!!form.formState.errors.password}
          helperText={form.formState.errors.password?.message ? t(form.formState.errors.password?.message) : ''}
          {...form.register('password')}
        />

        <FormErrors error={error} />
      </div>

      <div className="mt-15 flex flex-col gap-2 self-center">
        <Button type="submit" disabled={isPending}>
          {t('Signup')}
        </Button>
        <ButtonLink variant="text" to="/auth/login" search={identity}>
          {t('I have an account')}
        </ButtonLink>
      </div>
    </form>
  );
};
