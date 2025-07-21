import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import { identity } from 'lodash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { type LoginFormValues, loginSchema, useLogin } from '~/features';
import { setCookie } from 'typescript-cookie';
import { Button, ButtonLink, FormErrors, PasswordField, TextField } from '~/shared';

export const LoginForm = () => {
  const { t } = useTranslation();
  const { register, formState, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const {
    mutateAsync: login,
    isPending,
    error,
  } = useLogin({
    onSuccess: (data) => {
      router.invalidate();
      if (data.access_token && data.refresh_token) {
        localStorage.setItem('access_token', data.access_token);
        setCookie('refresh_token', data.refresh_token, {
          sameSite: 'strict',
          secure: true,
          path: '/',
          expires: 7,
        });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents" noValidate>
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

        <FormErrors error={error} />
      </div>

      <div className="mt-15 flex flex-col gap-2 self-center">
        <Button type="submit" disabled={isPending}>
          {t('Login')}
        </Button>
        <ButtonLink to="/auth/forgot-password" search={identity} variant="text">
          {t('Forgot password')}
        </ButtonLink>
      </div>
    </form>
  );
};
