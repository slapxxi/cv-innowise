import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import i18n from '~/app/i18n';
import { useSignup } from '~/features';
import { Button, ButtonLink, FormErrors, PasswordField, TextField, Title } from '~/shared';

export const Route = createFileRoute('/auth/_authLayout/signup')({
  head: () => ({ meta: [{ title: i18n.t('Signup') }] }),
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({ to: '/' });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const formSchema = z.object({
    email: z.string().nonempty(t('Email is required')),
    password: z.string().nonempty(t('Password is required')),
  });
  type Form = z.infer<typeof formSchema>;
  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
  });
  const search = Route.useSearch();
  const { signup, isPending, error } = useSignup({
    onSuccess: (data) => {
      sessionStorage.setItem('access_token', data.access_token);
      nav({ to: '/' });
    },
  });

  const handleSubmit: SubmitHandler<Form> = (data) => {
    signup(data);
  };

  return (
    <section className="flex flex-col">
      <header className="flex flex-col items-center gap-6 mb-10">
        <Title asChild>
          <h2>{t('Register')}</h2>
        </Title>
        <p>{t('Welcome')}</p>
      </header>

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
          <ButtonLink variant="text" to="/auth/login" search={search}>
            {t('I have an account')}
          </ButtonLink>
        </div>
      </form>
    </section>
  );
}
