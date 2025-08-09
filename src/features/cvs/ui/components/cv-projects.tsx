import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { t } from 'i18next';
import { useAuth } from '~/app';
import { cnMarkedText, cnSubtitle, type CvPreviewProps } from '~/features';
import { cn } from '~/shared';

export const CvProjects = ({ cv }: CvPreviewProps) => {
  const auth = useAuth();

  return (
    <article className={'mt-6'}>
      <header>
        <Typography className={cnSubtitle} variant={'h2'}>
          {t('Projects')}
        </Typography>
      </header>

      {cv.projects?.map((pr) => (
        <Box component={'section'} key={pr.id} className={'grid grid-cols-[1fr_3fr] gap-6 items-start '}>
          <Box className={''}>
            <Typography className={cn(cnMarkedText, 'font-semibold mb-2')}>{pr.name}</Typography>
            <Typography>{pr.description}</Typography>
          </Box>

          <Box className={' pl-6 pb-4 border-l-2 border-primary'}>
            <Typography className={cnSubtitle}>{t('Project roles')}</Typography>
            <Typography>{auth.user?.positionName}</Typography>
            <Typography className={cnSubtitle}>{t('Period')}</Typography>
            <Typography component={'time'} dateTime={pr.startDate}>
              {pr.startDate} - {pr.endDate ?? 'Till now'}
            </Typography>
            <Typography className={cnSubtitle}>{t('Responsibilities')}</Typography>
            <Typography className={cnSubtitle}>{t('Environments')}</Typography>
            <Typography>
              {pr.environment.map((e, i) => (
                <span key={i}>
                  {e}
                  {i < pr.environment.length - 1 ? ', ' : '.'}
                </span>
              ))}
            </Typography>
          </Box>
        </Box>
      ))}
    </article>
  );
};
