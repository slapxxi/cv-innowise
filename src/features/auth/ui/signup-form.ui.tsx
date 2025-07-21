import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import { identity } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { useSignup } from '~/features';
import { Button, ButtonLink, FormErrors, PasswordField, TextField } from '~/shared';

export const SignupForm = () => {
  const { t } = useTranslation();
  const formSchema = z.object({
    email: z.string().nonempty(t('Email is required')),
    password: z.string().nonempty(t('Password is required')),
  });
  type SignupForm = z.infer<typeof formSchema>;
  const form = useForm<SignupForm>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();
  const { signup, isPending, error } = useSignup({
    onSuccess: () => {
      router.invalidate();
    },
  });

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
          helperText={form.formState.errors.email?.message}
          {...form.register('email')}
        />

        <PasswordField
          label={t('Password')}
          placeholder={t('Password')}
          error={!!form.formState.errors.password}
          helperText={form.formState.errors.password?.message}
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
