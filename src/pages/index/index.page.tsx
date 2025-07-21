import { Link } from '@tanstack/react-router';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useAutoRefetchToken } from '~/shared';

export function IndexPage() {
  const { t } = useTranslation();
  useAutoRefetchToken();
  return (
    <div className="p-2 flex flex-col gap-4">
      <Link to="/about">About</Link>

      <Button variant="contained" className="bg-pink-600 animate-bounce">
        MUI Button
      </Button>

      <p className="text-gray-600">{t('Welcome to React')}</p>
    </div>
  );
}
