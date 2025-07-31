import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { cnSubtitle } from '~/features';
import { Button } from '~/shared';
import { useAuth } from '~/app';
import { t } from 'i18next';
import { useExportPdf } from '~/features';

export const CvHeader = () => {
  const auth = useAuth();
  const { mutate: exportPdf, isPending } = useExportPdf();

  const handleExportClick = () => {
    const cvContent = document.querySelector('#cv-preview')?.outerHTML;

    if (!cvContent) {
      console.error('Could not find CV content to export');
      return;
    }

    exportPdf({
      html: cvContent,
      margin: {
        top: '20',
        right: '20',
        bottom: '20',
        left: '20',
      },
    });
  };

  return (
    <header className={'flex justify-between items-center mb-6'}>
      <Box className={'flex flex-col max-w-sm gap-2'}>
        <Typography component={'h1'} className={cnSubtitle}>
          {auth?.user.profile.fullName}
        </Typography>
        <Typography component={'h2'}>{auth?.user.positionName}</Typography>
      </Box>
      <div className="flex items-center gap-4 no-print">
        <Button variant={'outlined'} onClick={handleExportClick} disabled={isPending}>
          {isPending ? t('Exporting...') : t('Export PDF')}
        </Button>
      </div>
    </header>
  );
};
