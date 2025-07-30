import { type CvWithSkillsByCategories } from '~/shared';
import { Box, Typography } from '@mui/material';
import { CvHeader, CvMain, CvProjects, CvSkillsTable } from '~/features';

export type CvPreviewProps = {
  cv: CvWithSkillsByCategories;
};
export const cnSubtitle = 'text-xl font-semibold pt-4 pb-2';
export const cnMarkedText = 'text-primary';

export function CvPreview({ cv }: CvPreviewProps) {
  // const cnFlex=
  return (
    <section className={'max-w-4xl mx-auto'}>
      <Box className="space-y-4 p-6 ">
        <CvHeader />
        <CvMain cv={cv} />
        <CvProjects cv={cv} />
        <section className={'mt-6'}>
          <Typography className={cnSubtitle} component={'h3'}>
            Professional Skills
          </Typography>
          <CvSkillsTable categories={cv.skillsByCategories} projects={cv.projects ?? []} />
        </section>
      </Box>
    </section>
  );
}
