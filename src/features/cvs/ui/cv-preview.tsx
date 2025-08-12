import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { type CvWithSkillsByCategories } from '~/shared/types';
import { CvHeader, CvMain, CvProjects, CvSkillsTable } from './components';

export type CvPreviewProps = {
  cv: CvWithSkillsByCategories;
};
export const cnSubtitle = 'text-xl font-semibold pt-4 pb-2';
export const cnMarkedText = 'text-primary';
export const PageBreak = styled('div')({
  pageBreakAfter: 'always',
});

export function CvPreview({ cv }: CvPreviewProps) {
  const { t } = useTranslation();

  return (
    <section id={'cv-preview'} className={'max-w-4xl mx-auto'}>
      <Box className="space-y-4 p-6 ">
        <CvHeader />
        <CvMain cv={cv} />
        <PageBreak />
        <CvProjects cv={cv} />
        <PageBreak />
        <section className={'mt-6'}>
          <Typography className={cnSubtitle} component={'h3'}>
            {t('Professional Skills')}
          </Typography>
          <CvSkillsTable categories={cv.skillsByCategories} projects={cv.projects ?? []} />
        </section>
      </Box>
    </section>
  );
}
