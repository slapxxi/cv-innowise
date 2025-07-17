import { Tab, Tabs } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, PasswordField, TextField } from '~/shared';

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
  loader: () => {
    console.log('loader');
    return { value: 100 };
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const { t } = useTranslation();
  const [value, setValue] = useState('login');

  console.log(data);

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="h-screen flex flex-col max-w-lg mx-auto">
      <header className="flex justify-center">
        <Tabs value={value} onChange={handleChangeTab}>
          <Tab label="Login" value="login"></Tab>
          <Tab label="Sign Up" value="signup"></Tab>
        </Tabs>
      </header>

      <div className="flex flex-col gap-15 p-4 my-auto">
        <div className="flex flex-col gap-4">
          <TextField label={t('Email')} type="email" />
          <PasswordField label={t('Password')} />
        </div>
        <div className="flex flex-col gap-2 self-center">
          <Button>{t('Signup')}</Button>
          <Button variant="text">{t('I have an account')}</Button>
        </div>
      </div>
    </div>
  );
}
