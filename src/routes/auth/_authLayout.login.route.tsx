import { createFileRoute } from '@tanstack/react-router';
import type { AuthInput } from 'cv-graphql';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '~/features';
import { Button, ButtonLink, PasswordField, TextField, Title } from '~/shared';

export const Route = createFileRoute('/auth/_authLayout/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<AuthInput>();

  const { mutate: loginMutation, isPending } = useLoginMutation();

  const onSubmit = (data: AuthInput) => {
    loginMutation(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <header className="flex flex-col items-center gap-6 mb-10">
        <Title asChild>
          <h2>{t('Welcome back')}</h2>
        </Title>
        <p>{t('Happy to see you')}</p>
      </header>

      <div className="flex flex-col gap-4">
        <TextField label={t('Email')} type="email" {...register('email')} />

        <PasswordField label={t('Password')} {...register('password')} />
      </div>

      <div className="mt-15 flex flex-col gap-2 self-center">
        <Button type="submit" disabled={isPending}>
          {' '}
          {t('Login')}
        </Button>
        <ButtonLink to="/auth/forgot-password" variant="text">
          {t('Forgot password')}
        </ButtonLink>
      </div>
    </form>
  );
}
