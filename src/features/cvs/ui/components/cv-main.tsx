import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { groupUserSkillsByParent, useSkills } from '~/features/skills';
import { type CvPreviewProps, cnSubtitle } from '../cv-preview';

export const CvMain = ({ cv }: CvPreviewProps) => {
  const { t } = useTranslation();
  const { skills: allSkills } = useSkills();
  const userSkills = cv.skills;
  const groupedSkills = groupUserSkillsByParent(allSkills, userSkills);

  return (
    <article className={'mt-6'}>
      <Box className={'grid grid-cols-[1fr_3fr] gap-6 items-start'}>
        <Box className={'flex flex-col gap-y-2 '}>
          <Typography className={cnSubtitle}>{t('Education')}</Typography>
          <Typography>{cv.education}</Typography>
          <Typography className={cnSubtitle}>{t('Language proficiency')}</Typography>
          {cv.languages.map((l, i) => (
            <Typography key={i}>{l.name}</Typography>
          ))}
          <Typography className={cnSubtitle}>{t('Domains')}</Typography>
          {cv?.projects?.map((pr) => (
            <span key={pr.id}>{pr.domain}</span>
          ))}
        </Box>
        <Box className={'pl-6 pb-4 flex flex-col gap-y-2 border-l-2 border-primary'}>
          <Typography variant={'subtitle1'} className={cnSubtitle}>
            {cv.name}
          </Typography>
          <Typography>{cv.description}</Typography>
          <Box>
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <Box key={category} className="mb-4">
                <Typography className={cnSubtitle}>{category}</Typography>
                <Box className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Box key={skill.id} className="px-3 py-1">
                      {skill.name}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </article>
  );
};
