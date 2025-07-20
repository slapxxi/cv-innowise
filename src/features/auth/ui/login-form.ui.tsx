import { Button, ButtonLink, PasswordField, TextField, Title } from '~/shared';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import type { AuthInput } from 'cv-graphql';
import { useLogin, type LoginFormValues, loginSchema } from '~/features';
import { zodResolver } from '@hookform/resolvers/zod';

export const LoginForm = () => {
  const nav = useNavigate();
  const { t } = useTranslation();

  const { register, formState, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const {
    mutateAsync: login,
    isPending,
    error,
  } = useLogin({
    onSuccess: (data) => {
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      nav({ to: '/' });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const onSubmit = (data: AuthInput) => {
    login(data);
  };
  return (
    <section className="flex flex-col">
      <header className="flex flex-col items-center gap-6 mb-10">
        <Title asChild>
          <h2>{t('Welcome back')}</h2>
        </Title>
        <p>{t('Happy to see you')}</p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="contents">
        <div className="flex flex-col gap-4">
          <TextField
            label={t('Email')}
            type="email"
            error={!!formState.errors.email}
            helperText={formState.errors.email?.message}
            {...register('email')}
          />

          <PasswordField
            label={t('Password')}
            error={!!formState.errors.password}
            helperText={formState.errors.password?.message}
            {...register('password')}
          />
          {error?.errors?.length === 0 && <p className="text-error">{t(error.message)}</p>}

          {error?.errors && (
            <ul className="text-error">
              {error.errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
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
    </section>
  );
};
