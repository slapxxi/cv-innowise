import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { cnSubtitle } from '~/features';
import { Button } from '~/shared';
import { useAuth } from '~/app';
import { t } from 'i18next';

export const CvHeader = () => {
  const auth = useAuth();
  return (
    <header className={'flex justify-between items-center'}>
      <Box className={'flex flex-col max-w-sm gap-2'}>
        <Typography component={'h1'} className={cnSubtitle}>
          {auth?.user.profile.fullName}
        </Typography>
        <Typography component={'h2'}>{auth?.user.positionName}</Typography>
      </Box>
      <Button variant={'outlined'}>{t('Export PDF')}</Button>
    </header>
  );
};
