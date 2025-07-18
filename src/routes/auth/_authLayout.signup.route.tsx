import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button, PasswordField, TextField, Title } from '~/shared';
import { useForm } from 'react-hook-form';
import type { AuthInput } from 'cv-graphql';
import { useSignupMutation } from '~/features/auth/api/use-signup.ts';

export const Route = createFileRoute('/auth/_authLayout/signup')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const nav = Route.useNavigate();
  const { register, handleSubmit } = useForm<AuthInput>();
  const { mutate: signupMutation, isPending } = useSignupMutation();

  const onSubmit = (data: AuthInput) => {
    signupMutation(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <header className="flex flex-col items-center gap-6 mb-10">
        <Title asChild>
          <h2>{t('Register')}</h2>
        </Title>
        <p>{t('Welcome')}</p>
      </header>

      <div className="flex flex-col gap-4">
        <TextField label={t('Email')} type="email" {...register('email')} />
        <PasswordField label={t('Password')} {...register('password')} />
      </div>

      <div className="mt-15 flex flex-col gap-2 self-center">
        <Button type="submit" disabled={isPending}>
          {t('Signup')}
        </Button>
        <Button variant="text" onClick={() => nav({ to: '/auth/login' })}>
          {t('I have an account')}
        </Button>
      </div>
    </form>
  );
}
